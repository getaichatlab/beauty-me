from pathlib import Path
from reportlab.pdfgen import canvas
from pypdf import PdfReader
import pypdfium2 as pdfium
import json
root=Path(__file__).parent
output=root.parent/'output'/'Beauty-Me-Taklif-250-Sayqallangan.pdf'
# The PDF shares the exact checked slide artwork; the PPTX retains editable text.
pdf=canvas.Canvas(str(output),pagesize=(960,540),pageCompression=1)
pdf.setTitle('Beauty Me | Sayt, CRM va Telegram bot taklifi')
pdf.setAuthor('Beauty Me demo konsepti')
for number in range(1,7):
    pdf.drawImage(str(root/'offer-renders'/f'slide-{number}.png'),0,0,width=960,height=540)
    if number==6:
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/uz/',(605,130,758,168),relative=0,thickness=0)
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/admin/demo/',(773,130,925,168),relative=0,thickness=0)
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/uz/',(601,218,740,357),relative=0,thickness=0)
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/admin/demo/',(771,218,910,357),relative=0,thickness=0)
    pdf.showPage()
pdf.save()
reader=PdfReader(output)
assert len(reader.pages)==6
links=[a.get_object()['/A']['/URI'] for a in reader.pages[5]['/Annots']]
assert len(links)==4
document=pdfium.PdfDocument(output)
target=root/'offer-pdf-renders';target.mkdir(exist_ok=True)
for number in range(6):
    document[number].render(scale=2).to_pil().save(target/f'page-{number+1}.png')
(root/'offer-pdf-validation.json').write_text(json.dumps({'pages':6,'links':links,'bytes':output.stat().st_size},indent=2),encoding='utf-8')
print('PDF exported: 6 pages, four clickable links; pages rendered for review.')
