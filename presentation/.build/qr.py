from reportlab.graphics.barcode.qr import QrCodeWidget
from PIL import Image
from pathlib import Path
import json
root=Path(__file__).parent/'assets'
targets={'site':'https://beauty-me-tashkent-demo.netlify.app/uz/','admin':'https://beauty-me-tashkent-demo.netlify.app/admin/demo/'}
results=[]
for name,url in targets.items():
    widget=QrCodeWidget(url,barLevel='M')
    widget.qr.make()
    matrix=widget.qr.modules
    scale=12; border=4; size=(len(matrix)+border*2)*scale
    image=Image.new('RGB',(size,size),'white')
    pixels=image.load()
    for y,row in enumerate(matrix):
        for x,dark in enumerate(row):
            if dark:
                for yy in range((y+border)*scale,(y+border+1)*scale):
                    for xx in range((x+border)*scale,(x+border+1)*scale): pixels[xx,yy]=(0,0,0)
    image.save(root/f'qr-{name}.png')
    assert image.getpixel((0,0))==(255,255,255)
    results.append({'name':name,'url':url,'modules':len(matrix),'quietZoneModules':border,'pixels':size})
(root/'qr-validation.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print('Two standard QR codes generated with 4-module quiet zones.')
