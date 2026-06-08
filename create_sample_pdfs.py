from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def create_sample_pdf(filename, num_pages):
    """Create a sample PDF with specified number of pages"""
    filepath = os.path.join('sample-pdfs', filename)
    c = canvas.Canvas(filepath, pagesize=letter)
    
    for page_num in range(1, num_pages + 1):
        # Add content to page
        c.setFont("Helvetica-Bold", 24)
        c.drawString(50, 750, f"{filename}")
        
        c.setFont("Helvetica", 14)
        c.drawString(50, 700, f"Page {page_num} of {num_pages}")
        
        # Add some sample text
        c.setFont("Helvetica", 12)
        text = f"""
This is page {page_num} of the {filename} document.

Sample content to demonstrate PDF page counting.
This PDF has {num_pages} pages in total.

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        """
        y = 650
        for line in text.strip().split('\n'):
            c.drawString(50, y, line)
            y -= 20
        
        # Add page footer
        c.setFont("Helvetica", 10)
        c.drawString(50, 50, f"Generated Sample PDF - Page {page_num}")
        
        # Show new page (except for the last page)
        if page_num < num_pages:
            c.showPage()
    
    c.save()
    print(f"Created: {filename} with {num_pages} pages")

# Create sample PDFs
if not os.path.exists('sample-pdfs'):
    os.makedirs('sample-pdfs')

sample_pdfs = [
    ('report-2024.pdf', 5),
    ('presentation.pdf', 12),
    ('manual.pdf', 8),
    ('guide.pdf', 15),
    ('summary.pdf', 3),
    ('whitepaper.pdf', 20),
]

for filename, pages in sample_pdfs:
    create_sample_pdf(filename, pages)

print(f"\nCreated {len(sample_pdfs)} sample PDFs in the 'sample-pdfs' folder")
