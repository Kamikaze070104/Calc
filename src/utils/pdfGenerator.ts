import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Fungsi untuk menghasilkan PDF dari elemen HTML
export const generatePDF = async (elementId: string, filename: string) => {
  try {
    // Dapatkan elemen yang akan dikonversi ke PDF
    const element = document.getElementById(elementId);
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      return;
    }

    // Buat canvas dari elemen HTML
    const canvas = await html2canvas(element, {
      scale: 2, // Meningkatkan kualitas dengan scale factor
      useCORS: true, // Mengizinkan cross-origin images
      logging: false, // Matikan logging untuk produksi
      backgroundColor: '#0f172a', // Warna background sesuai dengan tema aplikasi
    });

    // Dapatkan dimensi canvas
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    // Inisialisasi PDF dengan orientasi potrait dan unit mm
    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Tambahkan gambar ke halaman pertama
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Tambahkan halaman baru jika konten melebihi satu halaman
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Simpan PDF dengan nama file yang diberikan
    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};