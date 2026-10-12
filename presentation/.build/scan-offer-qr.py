from pathlib import Path
import sys,json
from PIL import Image
root=Path(__file__).parent
sys.path.insert(0,str(root/'qa-deps'))
import zxingcpp
expected={'https://beauty-me-tashkent-demo.netlify.app/uz/','https://beauty-me-tashkent-demo.netlify.app/admin/demo/'}
reports=[]
for relative in ['offer-renders/slide-6.png','offer-pdf-renders/page-6.png','offer-final-renders/slide-6.png']:
    picture=Image.open(root/relative)
    results=zxingcpp.read_barcodes(picture)
    found={r.text for r in results}
    assert found==expected,(relative,found)
    reports.append({'file':relative,'decodedUrls':sorted(found)})
(root/'offer-qr-scan-report.json').write_text(json.dumps(reports,indent=2),encoding='utf-8')
print('Both QR codes independently decoded from slide render, exported PDF and final PPTX render.')
