import fitz,glob,re,os
from PIL import Image,ImageOps,ImageDraw
import argparse
from pathlib import Path
parser=argparse.ArgumentParser(description='Wrap the private source PDF in the Nima Diner book design.')
parser.add_argument('--source', required=True, help='Private original content PDF (46 pages for this edition)')
parser.add_argument('--output', default='output/book/nimasdiner-restaurant-handbook.pdf')
args=parser.parse_args()
ROOT=str(Path(__file__).resolve().parents[1])
FONT=ROOT+'/assets'
WORK=ROOT+'/tmp/book'
os.makedirs(WORK,exist_ok=True)
Path(args.output).resolve().parent.mkdir(parents=True,exist_ok=True)
Image.open(ROOT+'/assets/cover.webp').convert('RGB').save(WORK+'/cover.png')
Image.open(ROOT+'/assets/nima-afshar-naderi.webp').convert('RGB').save(WORK+'/author.jpg')
Y=(1,.80,.08); INK=(.10,.13,.15); RED=(.76,.20,.15); CREAM=(1,.98,.93)
W,H=612,918
out=fitz.open();src=fitz.open(args.source)
if len(src)!=46:raise ValueError('This layout expects the 46-page source edition. Update chapter offsets, TOC and page counts before using a different source.')
css='''@font-face{font-family:v;src:url(Vazirmatn-Regular.ttf)} @font-face{font-family:v;src:url(Vazirmatn-Bold.ttf);font-weight:bold} *{font-family:v} body{direction:rtl;text-align:right;color:#1a2126;font-size:14px;line-height:1.9;margin:0} h1{font-size:35px;line-height:1.5;margin:0 0 20px} h2{font-size:23px;line-height:1.65;margin:0 0 18px} p{margin:0 0 18px} a{color:#ab382b;text-decoration:none}'''
archive=fitz.Archive(FONT)
def box(p,rect,text,sz=14,align='right',color='#1a2126'):
 align = 'left' if align == 'right' else ('right' if align == 'left' else align)
 html=f'<div dir="rtl" style="direction:rtl;width:100%;font-size:{sz}px;text-align:{align};color:{color}">{text}</div>'
 r=p.insert_htmlbox(fitz.Rect(rect),html,css=css,archive=archive,scale_low=1)
 if r[0]<0:raise RuntimeError(('OVERFLOW',rect,text[:80]))
def checker(p,y,width=140):
 s=width/14;x=(W-width)/2
 for r in range(2):
  for c in range(14):p.draw_rect(fitz.Rect(x+c*s,y+r*s,x+(c+1)*s,y+(r+1)*s),color=None,fill=RED if (r+c)%2==0 else CREAM)
def blank(label='',num=None):
 p=out.new_page(width=W,height=H);p.draw_rect(p.rect,color=None,fill=(1,1,1));p.draw_rect(fitz.Rect(0,0,W,12),color=None,fill=Y)
 if label:box(p,(48,35,564,64),label,10)
 if num is not None:
  p.draw_line((48,862),(564,862),color=(.87,.87,.85),width=.6)
  box(p,(275,875,337,905),str(num).translate(str.maketrans('0123456789','۰۱۲۳۴۵۶۷۸۹')),10,'center')
  box(p,(380,875,564,903),'نیما داینر | راهنمای مدیریت رستوران',9)
 return p
# Cover
p=out.new_page(width=W,height=H);p.insert_image(p.rect,filename=WORK+'/cover.png')
# Title page
p=blank();box(p,(55,125,557,175),'نیما داینر',16,'right','#b43a2b')
box(p,(55,225,557,390),'<b>مرجع جامع<br>مدیریت رستوران</b>',42,'right')
p.draw_rect(fitz.Rect(275,430,557,480),color=None,fill=INK)
box(p,(280,434,552,480),'<b>۱۰۱ قانون طلایی</b>',24,'right','#ffcf20')
box(p,(70,505,542,600),'از استانداردهای جهانی<br>تا واقعیت بازار ایران',21,'right')
box(p,(60,708,552,754),'<b>نیما افشارنادری</b>',20,'right');checker(p,800)
# Colophon
p=blank('شناسنامهٔ اثر',2)
box(p,(55,90,557,150),'<b>شناسنامهٔ اثر</b>',29)
box(p,(55,165,557,310),'<b>عنوان:</b> مرجع جامع مدیریت رستوران<br><b>نویسنده:</b> نیما افشارنادری<br><b>ناشر:</b> مؤلف',16)
box(p,(55,320,557,380),'سردبیر <a href="https://pendar.io">پندار</a> | <a href="https://grokipedia.com/page/nima-afshar-naderi">معرفی در گروکی‌پدیا</a>',15)
box(p,(55,393,557,440),'<b>صفحه‌ها و راه‌های تماس</b>',19)
box(p,(55,445,557,610),'<a href="https://www.instagram.com/nimasdiner">instagram.com/nimasdiner</a><br><a href="https://t.me/nimasdiner">تلگرام نیما داینر؛ محتوای روزانه</a><br><a href="https://x.com/nimania">x.com/nimania</a><br><a href="mailto:nimania@gmail.com">nimania@gmail.com</a><br><a href="https://t.me/nimaafsharnaderi">t.me/nimaafsharnaderi</a>',15)
p.draw_line((55,620),(557,620),color=(.85,.85,.82),width=.7)
box(p,(235,645,557,695),'<b>از خواندن، به اجرا برسیم</b>',20)
box(p,(235,710,557,810),'برای هماهنگی مشاورهٔ رستوران، کد را اسکن کنید؛ دربارهٔ مسئلهٔ مجموعه‌تان گفت‌وگو کنیم.',14)
import qrcode
qr=qrcode.make('https://t.me/nimaafsharnaderi');qr.save(WORK+'/consult-qr.png')
p.insert_image(fitz.Rect(55,650,215,810),filename=WORK+'/consult-qr.png')
p.insert_link({'kind':fitz.LINK_URI,'from':fitz.Rect(55,650,215,810),'uri':'https://t.me/nimaafsharnaderi'})
# Reader guide
p=blank('راهنمای استفاده از کتاب',3)
box(p,(55,110,557,180),'<b>از کجا شروع کنیم؟</b>',30)
for y,title,body in [(225,'پیش از راه‌اندازی','از فصل اول شروع کنید؛ سپس اقتصاد رستوران و مهندسی منو را پیش از خرید تجهیزات و نهایی‌کردن قیمت‌ها بخوانید.'),(385,'برای رستورانِ در حال کار','ابتدا مسئلهٔ اصلی را مشخص کنید: هزینه، منو، عملیات، کارکنان یا تجربهٔ مشتری. از فهرست به فصل مربوط بروید.'),(545,'برای اجرای روزانه','قانون‌های مرتبط را به اقدام مشخص تبدیل کنید و از چک‌لیست‌های پایانی برای بازگشایی و بستن شیفت کمک بگیرید.')]:
 p.draw_rect(fitz.Rect(549,y+7,557,y+35),color=None,fill=RED)
 box(p,(55,y,535,y+55),'<b>'+title+'</b>',19)
 box(p,(55,y+65,557,y+150),body,14)
box(p,(55,767,557,825),'یادداشت این ویرایش: داده‌ها، نسبت‌ها و الزامات تخصصی متن در این مرحله راستی‌آزمایی مستقل نشده‌اند و پیش از انتشار نهایی نیازمند بازبینی‌اند.',10)
chapters=[('فصل اول','امکان‌سنجی، مدل کسب‌وکار و انتخاب ملک','۱ تا ۱۵',1),('فصل دوم','اقتصاد رستوران و مدیریت مالی','۱۶ تا ۳۰',8),('فصل سوم','مهندسی منو، رسپی و قیمت‌گذاری','۳۱ تا ۴۵',14),('فصل چهارم','عملیات آشپزخانه، تدارکات و بهداشت','۴۶ تا ۶۰',20),('فصل پنجم','منابع انسانی و عملیات سالن','۶۱ تا ۷۵',26),('فصل ششم','تجربهٔ مشتری، بازاریابی و دلیوری','۷۶ تا ۹۰',33),('فصل هفتم','ایمنی، مجوزها و استراتژی‌های پیشرفته','۹۱ تا ۱۰۱',39),('پیوست اجرایی','چهار چک‌لیست عملیاتی روزانه','',44)]
p=blank('فهرست مطالب',4);tocpage=p.number
box(p,(55,105,557,168),'<b>فهرست مطالب</b>',30)
for k,(name,title,rng,n) in enumerate(chapters):
 y=192+k*76
 box(p,(110,y,557,y+30),'<b>'+name+'</b> <span style="font-size:11px;color:#6b6b6b">'+(' | قوانین '+rng if rng else '')+'</span>',15)
 box(p,(110,y+31,557,y+65),title,13)
 box(p,(55,y+10,95,y+49),str(n+4).translate(str.maketrans('0123456789','۰۱۲۳۴۵۶۷۸۹')),17,'center','#b43a2b')
 p.draw_line((55,y+69),(557,y+69),color=(.87,.87,.85),width=.5)
 # Contents links inserted after all pages exist
# Restyle source colors without retyping/reflowing text
for pg in src:
 for x in pg.get_contents():
  d=src.xref_stream(x)
  for old in [b'.2471 .2157 .7882',b'.4471 .0353 .7176']:
   d=d.replace(old+b' rg',b'.65 .16 .11 rg').replace(old+b' RG',b'.65 .16 .11 RG')
  src.update_stream(x,d)
for i,pg in enumerate(src):
 label=next((c[0]+' | '+c[1] for c in reversed(chapters) if i+1>=c[3]),'مقدمه')
 p=blank(label,i+5)
 p.show_pdf_page(fitz.Rect(0,65,612,857),src,i)
 # Branded tab in outside margin
 p.draw_rect(fitz.Rect(590,110,612,153),color=None,fill=Y)
# Contact page
p=blank('ارتباط با نویسنده',51)
box(p,(55,90,557,155),'<b>گفت‌وگو را ادامه بدهیم</b>',30)
p.insert_image(fitz.Rect(55,180,230,357),filename=WORK+'/author.jpg')
box(p,(250,180,557,235),'<b>نیما افشارنادری</b>',23)
box(p,(250,245,557,330),'سردبیر <a href="https://pendar.io">پندار</a><br><a href="https://grokipedia.com/page/nima-afshar-naderi">معرفی در گروکی‌پدیا</a>',15)
box(p,(55,385,557,470),'برای آموزش‌های رستوران‌داری، پیشنهاد اصلاح مطالب و هماهنگی مشاوره، با نیما داینر در ارتباط باشید.',16)
box(p,(55,480,557,605),'<a href="https://www.instagram.com/nimasdiner">instagram.com/nimasdiner</a><br><a href="https://t.me/nimasdiner">تلگرام نیما داینر؛ محتوای روزانه</a><br><a href="mailto:nimania@gmail.com">nimania@gmail.com</a><br><a href="https://t.me/nimaafsharnaderi">t.me/nimaafsharnaderi</a>',15)
p.draw_line((55,610),(557,610),color=(.85,.85,.82),width=.7)
box(p,(235,640,557,695),'<b>مسئلهٔ رستوران شما چیست؟</b>',20)
box(p,(235,710,557,815),'برای هماهنگی مشاوره و گفت‌وگو دربارهٔ منو، قیمت‌گذاری و عملیات مجموعه‌تان، کد را اسکن کنید.',14)
p.insert_image(fitz.Rect(55,650,215,810),filename=WORK+'/consult-qr.png')
p.insert_link({'kind':fitz.LINK_URI,'from':fitz.Rect(55,650,215,810),'uri':'https://t.me/nimaafsharnaderi'})
# Fix TOC links
p=out[tocpage]
for l in p.get_links():p.delete_link(l)
for k,c in enumerate(chapters):p.insert_link({'kind':fitz.LINK_GOTO,'from':fitz.Rect(45,192+k*76,565,261+k*76),'page':c[3]+4})
out.set_toc([[1,'آغاز کتاب',2],[1,'شناسنامهٔ اثر',3],[1,'راهنمای استفاده',4],[1,'فهرست مطالب',5]]+[[1,c[0]+': '+c[1],c[3]+5] for c in chapters]+[[1,'ارتباط با نویسنده',52]])
out.set_metadata({'title':'مرجع جامع مدیریت رستوران | ۱۰۱ قانون طلایی','author':'نیما افشارنادری','subject':'نیما داینر - نسخهٔ پیش‌نویس برای بازبینی','keywords':'رستوران، مدیریت، نیما داینر، ۱۰۱ قانون'})
out.save(args.output,garbage=4,deflate=True)
print('pages',len(out))
for i in [0,1,2,3,4,5,7,12,24,43,49,51]:
 out[i].get_pixmap(matrix=fitz.Matrix(.75,.75)).save(WORK+f'/page-{i+1}.png')
# Contact sheet
imgs=[]
for f in glob.glob(WORK+'/page-*.png'):
 im=Image.open(f).convert('RGB');im.thumbnail((230,345));can=Image.new('RGB',(250,375),'#ddd');can.paste(im,((250-im.width)//2,10));ImageDraw.Draw(can).text((10,355),os.path.basename(f),fill='black');imgs.append(can)
sheet=Image.new('RGB',(1000,375*((len(imgs)+3)//4)),'white')
for i,im in enumerate(imgs):sheet.paste(im,((i%4)*250,(i//4)*375))
sheet.save(WORK+'/contact-sheet.png')
