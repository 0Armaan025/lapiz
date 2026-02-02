import html2canvas from 'html2canvas';
import { CardElement, CardSettings } from '../create/page';

export class CardExporter {
  async exportAsPNG(cardElement: HTMLElement, settings: CardSettings): Promise<Blob> {
    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: null,
        scale: 2, // Higher quality
        width: settings.width,
        height: settings.height,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error exporting as PNG:', error);
      throw error;
    }
  }

  downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async copyImageToClipboard(blob: Blob) {
    try {
      const item = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([item]);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  }

  generateReadmeMarkdown(imageUrl: string, username: string): string {
    return `![GitHub Stats](${imageUrl})`;
  }

  generateReadmeHTML(imageUrl: string, username: string, profileUrl: string): string {
    return `<a href="${profileUrl}">
  <img src="${imageUrl}" alt="${username}'s GitHub Stats" />
</a>`;
  }

  // Generate a data URL for the card
  async generateDataURL(cardElement: HTMLElement, settings: CardSettings): Promise<string> {
    const blob = await this.exportAsPNG(cardElement, settings);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const cardExporter = new CardExporter();
