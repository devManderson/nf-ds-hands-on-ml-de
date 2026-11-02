# Exportiert die Folien eines Decks als PNG mit dem installierten PowerPoint (Windows).
# Wird von render.sh aufgerufen; das Deck liegt dann als deck.pptx in -Dir.
# PowerPoint läuft unsichtbar. Ein bereits geöffnetes PowerPoint des Nutzers wird nicht beendet.
param([string]$Dir, [string]$Only = "")
$ErrorActionPreference = "Stop"
$src = Join-Path $Dir "deck.pptx"
$out = Join-Path $Dir "png"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$want = @()
if ($Only -ne "") { $want = $Only.Split(",") | ForEach-Object { [int]$_ } }
$app = New-Object -ComObject PowerPoint.Application
$pres = $app.Presentations.Open($src, -1, 0, 0)  # schreibgeschützt, ohne Fenster
foreach ($sl in $pres.Slides) {
  if ($want.Count -eq 0 -or $want -contains $sl.SlideIndex) {
    $sl.Export(("{0}\slide-{1:D2}.png" -f $out, $sl.SlideIndex), "PNG", 1600, 900)
  }
}
$n = $pres.Slides.Count
$pres.Close()
if ($app.Presentations.Count -eq 0) { $app.Quit() }
Write-Output "PowerPoint: $n Folien im Deck"
