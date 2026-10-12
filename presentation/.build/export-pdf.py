from pathlib import Path
from reportlab.pdfgen import canvas
from pypdf import PdfReader
import pypdfium2 as pdfium
import json
root=Path(__file__).parent
output=root.parent/'output'/'Beauty-Me-Taqdimot.pdf'
# The PDF shares the exact checked slide artwork; the PPTX retains editable text.
pdf=canvas.Canvas(str(output),pagesize=(960,540),pageCompression=1)
pdf.setTitle('Beauty Me | Veb sayt va admin panel')
pdf.setAuthor('Beauty Me demo konsepti')
for number in range(1,6):
    pdf.drawImage(str(root/'renders'/f'slide-{number}.png'),0,0,width=960,height=540)
    if number==5:
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/uz/',(40,74,460,120),relative=0,thickness=0)
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/admin/demo/',(507,74,949,120),relative=0,thickness=0)
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/uz/',(112,176,308,371),relative=0,thickness=0)
        pdf.linkURL('https://beauty-me-tashkent-demo.netlify.app/admin/demo/',(586,176,782,371),relative=0,thickness=0)
    pdf.showPage()
pdf.save()
reader=PdfReader(output)
assert len(reader.pages)==5
links=[a.get_object()['/A']['/URI'] for a in reader.pages[4]['/Annots']]
assert len(links)==4
document=pdfium.PdfDocument(output)
target=root/'pdf-renders';target.mkdir(exist_ok=True)
for number in range(5):
    document[number].render(scale=2).to_pil().save(target/f'page-{number+1}.png')
(root/'pdf-validation.json').write_text(json.dumps({'pages':5,'links':links,'bytes':output.stat().st_size},indent=2),encoding='utf-8')
print('PDF exported: 5 pages, four clickable links; pages rendered for review.')
