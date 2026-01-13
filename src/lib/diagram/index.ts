import { getNodesBounds, getViewportForBounds, type Node } from '@xyflow/react';
import type { FlowData } from '@/types/diagram';
import { EXPORT_PADDING, EXPORT_SCALE } from '@/config/appConstants';

export type { FlowData } from '@/types/diagram';
// html-to-image is lazy loaded to reduce initial bundle size (~120KB savings)

export type ExportFormat = 'png' | 'svg' | 'json';

/**
 * Export flow as PNG image
 */
export async function exportAsPng(
    element: HTMLElement,
    nodes: Node[],
    filename: string = 'flowmind-diagram'
): Promise<void> {
    if (nodes.length === 0) {
        throw new Error('No nodes to export');
    }

    const nodesBounds = getNodesBounds(nodes);
    // Add padding to image dimensions for better visual spacing
    const imageWidth = (nodesBounds.width || 1024) + EXPORT_PADDING * 2;
    const imageHeight = (nodesBounds.height || 768) + EXPORT_PADDING * 2;

    // Adjust bounds to include padding
    const paddedBounds = {
        ...nodesBounds,
        x: nodesBounds.x - EXPORT_PADDING,
        y: nodesBounds.y - EXPORT_PADDING,
        width: imageWidth,
        height: imageHeight,
    };

    const transform = getViewportForBounds(
        paddedBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        0.1
    );

    // Lazy load html-to-image
    const { toPng } = await import('html-to-image');

    try {
        const dataUrl = await toPng(element, {
            backgroundColor: '#ffffff',
            width: imageWidth * EXPORT_SCALE,
            height: imageHeight * EXPORT_SCALE,
            style: {
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
            },
            pixelRatio: EXPORT_SCALE,
        });

        downloadDataUrl(dataUrl, `${filename}.png`);
    } catch (err) {
        console.error('PNG export failed, falling back to snapshot', err);
        // Fallback to simple screenshot with higher quality
        const dataUrl = await toPng(element, {
            backgroundColor: '#fff',
            pixelRatio: EXPORT_SCALE,
        });
        downloadDataUrl(dataUrl, `${filename}-snapshot.png`);
    }
}

/**
 * Export flow as SVG (vector format)
 */
export async function exportAsSvg(
    element: HTMLElement,
    nodes: Node[],
    filename: string = 'flowmind-diagram'
): Promise<void> {
    if (nodes.length === 0) {
        throw new Error('No nodes to export');
    }

    const nodesBounds = getNodesBounds(nodes);
    // Add padding to image dimensions for better visual spacing
    const imageWidth = (nodesBounds.width || 1024) + EXPORT_PADDING * 2;
    const imageHeight = (nodesBounds.height || 768) + EXPORT_PADDING * 2;

    // Adjust bounds to include padding
    const paddedBounds = {
        ...nodesBounds,
        x: nodesBounds.x - EXPORT_PADDING,
        y: nodesBounds.y - EXPORT_PADDING,
        width: imageWidth,
        height: imageHeight,
    };

    const transform = getViewportForBounds(
        paddedBounds,
        imageWidth,
        imageHeight,
        0.5,
        2,
        0.1
    );

    // Lazy load html-to-image
    const { toSvg } = await import('html-to-image');

    try {
        const dataUrl = await toSvg(element, {
            backgroundColor: '#ffffff',
            width: imageWidth * EXPORT_SCALE,
            height: imageHeight * EXPORT_SCALE,
            style: {
                width: `${imageWidth}px`,
                height: `${imageHeight}px`,
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
            },
        });

        downloadDataUrl(dataUrl, `${filename}.svg`);
    } catch (err) {
        console.error('SVG export failed, falling back to snapshot', err);
        // Fallback to simple screenshot
        const dataUrl = await toSvg(element, { backgroundColor: '#fff' });
        downloadDataUrl(dataUrl, `${filename}-snapshot.svg`);
    }
}

/**
 * Export flow as JSON (for backup/sharing)
 */
export function exportAsJson(
    data: FlowData,
    filename: string = 'flowmind-diagram'
): void {
    const exportData: FlowData = {
        nodes: data.nodes,
        edges: data.edges,
        viewport: data.viewport,
        metadata: {
            ...data.metadata,
            updatedAt: new Date().toISOString(),
            version: '1.0',
        },
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    downloadDataUrl(url, `${filename}.json`);
    URL.revokeObjectURL(url);
}

/**
 * Import flow from JSON file
 */
export async function importFromJson(file: File): Promise<FlowData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);

                // Validate the structure
                if (!json.nodes || !Array.isArray(json.nodes)) {
                    throw new Error('Invalid JSON: missing nodes array');
                }
                if (!json.edges || !Array.isArray(json.edges)) {
                    throw new Error('Invalid JSON: missing edges array');
                }

                resolve({
                    nodes: json.nodes,
                    edges: json.edges,
                    viewport: json.viewport,
                    metadata: json.metadata,
                });
            } catch (error) {
                reject(new Error(`Failed to parse JSON: ${(error as Error).message}`));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Helper function to trigger download
 */
function downloadDataUrl(dataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    link.click();
}
