import glob
import re

from io import StringIO
import json
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfdocument import PDFDocument
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.pdfpage import PDFPage
from pdfminer.pdfparser import PDFParser
import unidecode

def convert_pdf_to_txt(path):
    output_string = StringIO()
    with open(path, 'rb') as in_file:
        parser = PDFParser(in_file)
        doc = PDFDocument(parser)
        rsrcmgr = PDFResourceManager()
        device = TextConverter(rsrcmgr, output_string, laparams=LAParams())
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        for page in PDFPage.create_pages(doc):
            interpreter.process_page(page)
    return output_string.getvalue()

def formatPdf(str) :
    str = str.replace("\n"," ").replace("\x0c"," ")
    str = unidecode.unidecode(str)
    return re.sub(r"[-()\"#/@;:<>{}`'[\]+=\\_§*~|.!?,]", ' ', str)

AllPDFS = glob.glob("File/*.pdf")
Dico = {}
Number = 0
long = len(AllPDFS)
for PDF in AllPDFS :
    Number += 1
    print(f"{Number}/{long}")
    text = convert_pdf_to_txt(PDF)
    text = formatPdf(text)
    ListeMot = text.split(" ")
    PDF = PDF.replace("\\","/")
    if len(ListeMot) >= 2 :
        for i in ListeMot :
            i = i.lower()
            if i != "" and i != " " :
                if i in Dico.keys() :
                    if PDF in Dico[i].keys() :
                        Dico[i][PDF] += 1
                    else :
                        Dico[i][PDF] = 1
                else :
                    Dico[i] = {PDF : 1}

with open("Search.json","w") as f :
    json.dump(Dico,f)
    
print("Finish !!")
