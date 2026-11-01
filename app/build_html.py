import sys,os
HERE=os.path.dirname(os.path.abspath(__file__))
nav='''<nav role="tablist" id="tabs">
<button role="tab" data-tab="gen" aria-selected="true">Prosedür üretici</button>
<button role="tab" data-tab="matrix" aria-selected="false">Uygulanabilirlik matrisi</button>
<button role="tab" data-tab="cmp" aria-selected="false">Test karşılaştırma</button>
<button role="tab" data-tab="glossary" aria-selected="false">Sözlük ve ipuçları</button>
<button role="tab" data-tab="data" aria-selected="false">Veri yapısı</button>
<button role="tab" data-tab="method" aria-selected="false">Kaynak ve yöntem</button></nav>'''
r=lambda f:open(os.path.join(HERE,f),encoding='utf8').read()
html=f'''<!DOCTYPE html>
<html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>EMI/EMC Test Prosedürü Üretici – MIL-STD-461G</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Serif+4:wght@400;600&display=swap">
<style>{r('style.css')}</style></head><body>
<header><div class="hd-l"><div class="brand"><span class="mark">EMC</span><h1>EMI/EMC test prosedürü üretici</h1></div>
<p>MIL-STD-461G metninden çıkarılan yapılandırılmış veriyle çalışır: 19 test, uygulanabilirlik matrisi, limit tabloları ve ölçüm tabloları. Eksik girdileri ister, her adımda ne anlama geldiğini açıklar ve test mühendisinin gözden geçireceği prosedür taslağı üretir.</p></div><button id="themeBtn" type="button" aria-label="Temayı değiştir">Açık / koyu</button></header>
{nav}
<main id="main"></main>
<script>
{r('data.js')}
{r('help.js')}
{r('gen.js')}
{r('ui.js')}
</script></body></html>'''
if os.path.isdir('/mnt/user-data/outputs'):
    open('/mnt/user-data/outputs/emc-prosedur-uretici-v3.html','w',encoding='utf8').write(html)
kit=os.path.join(HERE,'..','public')
os.makedirs(kit,exist_ok=True)
open(kit+'/index.html','w',encoding='utf8').write(html.replace('<script>\n','<script>window.EMC_SERVER=true;\n',1))
