/** Fait télécharger `data` au navigateur sous forme de fichier JSON lisible. */
export function downloadJson(fileName: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  // Libérée au tour suivant : certains navigateurs lisent encore l'URL juste après le clic.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
