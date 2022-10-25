from PIL import Image

def pixel(r,g,b):
    img=Image.new('RGB',(100,100))
    for x in range(100) :
        for y in range(100) :
            img.putpixel((x,y),(r,g,b))
    img.show()