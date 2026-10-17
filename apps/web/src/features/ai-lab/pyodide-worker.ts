// ============================================================
// ITSEIA Academy — Pyodide Web Worker
// Feature: 010-ai-lab-advanced
// Ejecuta codigo Python en el navegador via WebAssembly
// Se instancia SOLO cuando el estudiante abre el Playground
// ============================================================

// Nota: este archivo se carga como Web Worker.
// No tiene acceso a DOM ni al thread principal.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const workerSelf = (typeof self !== "undefined" ? self : {}) as {
  importScripts: (...urls: string[]) => void;
  loadPyodide?: (opts: { indexURL: string }) => Promise<unknown>;
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage: (data: unknown) => void;
};

interface RunMessage {
  type: "run";
  code: string;
  language: "python" | "javascript";
}

interface OutputMessage {
  type: "output";
  output: string;
  error: string | null;
  duration_ms: number;
  has_image?: boolean;
  image_b64?: string;
}

// Estado del worker
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyodideType = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodideInstance: PyodideType = null;
let pyodideLoading = false;

// ── Cargar Pyodide (una vez por worker) ──
async function loadPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (pyodideLoading) {
    // Esperar que termine la carga
    while (pyodideLoading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return pyodideInstance;
  }

  pyodideLoading = true;

  try {
    // Importar Pyodide desde CDN
    workerSelf.importScripts(
      "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/pyodide.js"
    );

    // loadPyodide es inyectado por el script importado
    if (!workerSelf.loadPyodide) throw new Error("loadPyodide no disponible");
    pyodideInstance = await workerSelf.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/",
    }) as typeof pyodideInstance;

    // Configurar captura de stdout/stderr
    if (pyodideInstance) {
      pyodideInstance.runPython(`
import sys
import io

class OutputCapture:
    def __init__(self):
        self.data = []
    def write(self, s):
        self.data.append(s)
    def flush(self):
        pass
    def getvalue(self):
        return ''.join(self.data)

_stdout_capture = OutputCapture()
_stderr_capture = OutputCapture()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
`);
    }
  } catch (err) {
    pyodideLoading = false;
    throw err;
  }

  pyodideLoading = false;
  return pyodideInstance;
}

// ── Ejecutar Python ──
async function runPython(code: string): Promise<Omit<OutputMessage, "type">> {
  const start = Date.now();

  try {
    const pyodide = await loadPyodide();
    if (!pyodide) {
      return {
        output: "",
        error: "Error cargando el entorno Python. Recarga la pagina.",
        duration_ms: Date.now() - start,
      };
    }

    // Limpiar capturas anteriores
    pyodide.runPython(`
_stdout_capture.data = []
_stderr_capture.data = []
`);

    // Intentar cargar paquetes importados en el codigo
    try {
      await pyodide.loadPackagesFromImports(code);
    } catch {
      // No bloquear si hay errores cargando paquetes
    }

    // Ejecutar el codigo
    pyodide.runPython(code);

    // Recoger salida
    const stdout = pyodide.runPython("_stdout_capture.getvalue()") as string;
    const stderr = pyodide.runPython("_stderr_capture.getvalue()") as string;

    // Verificar si hay imagen matplotlib (base64)
    let imageb64: string | undefined;
    try {
      const imgCheck = pyodide.runPython(`
try:
    import matplotlib.pyplot as plt
    import base64, io as _io
    buf = _io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    result = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    result
except Exception:
    ''
`) as string;
      if (imgCheck && imgCheck.length > 100) {
        imageb64 = imgCheck;
      }
    } catch {
      // matplotlib no disponible, ignorar
    }

    return {
      output: stdout || "",
      error: stderr && stderr.trim().length > 0 ? stderr : null,
      duration_ms: Date.now() - start,
      has_image: !!imageb64,
      image_b64: imageb64,
    };
  } catch (err) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : "Error desconocido ejecutando el codigo.";

    return {
      output: "",
      error: errorMsg,
      duration_ms: Date.now() - start,
    };
  }
}

// ── Ejecutar JavaScript ──
async function runJavaScript(code: string): Promise<Omit<OutputMessage, "type">> {
  const start = Date.now();
  const logs: string[] = [];
  let errorMsg: string | null = null;

  // Sobreescribir console dentro del eval
  const sandboxConsole = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
    error: (...args: unknown[]) => logs.push("[error] " + args.map(String).join(" ")),
    warn: (...args: unknown[]) => logs.push("[warn] " + args.map(String).join(" ")),
    info: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
  };

  try {
    // Crear funcion con console sobreescrito
    const fn = new Function(
      "console",
      `
"use strict";
${code}
`
    );
    fn(sandboxConsole);
  } catch (err) {
    errorMsg = err instanceof Error ? err.message : String(err);
  }

  return {
    output: logs.join("\n"),
    error: errorMsg,
    duration_ms: Date.now() - start,
  };
}

// ── Listener de mensajes ──
workerSelf.onmessage = async (event: MessageEvent) => {
  const evt = event as MessageEvent<RunMessage>;
  const { type, code, language } = evt.data;

  if (type !== "run") return;

  let result: Omit<OutputMessage, "type">;

  if (language === "python") {
    result = await runPython(code);
  } else {
    result = await runJavaScript(code);
  }

  const response: OutputMessage = {
    type: "output",
    ...result,
  };

  workerSelf.postMessage(response);
};

// Notificar que el worker esta listo
workerSelf.postMessage({ type: "ready" });
