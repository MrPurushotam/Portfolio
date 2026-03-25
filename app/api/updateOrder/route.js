import { readData, writeData } from '@/utils/common';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { type, order } = await request.json();

        if (!type || !Array.isArray(order)) {
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }

        const currentData = await readData();
        if (!currentData) {
            return NextResponse.json({
                success: false,
                message: 'Failed to read current data'
            }, { status: 500 });
        }

        const currentIds = currentData[type].map(item => item.id);
        const isValidOrder = order.every(id => currentIds.includes(id)) &&
            order.length === currentData[type].length;

        if (!isValidOrder) {
            return NextResponse.json({
                success: false,
                message: 'Invalid order: contains invalid IDs or incorrect number of items'
            }, { status: 400 });
        }
        const orderedItems = order.map(id =>
            currentData[type].find(item => item.id === id)
        );
        const updatedData = {
            ...currentData,
            [type]: orderedItems
        };

        await writeData(updatedData);

        return NextResponse.json({
            success: true,
            message: `${type} order updated successfully`
        });
    } catch (error) {
        console.error('Error updating order:', {
            error: error.message,
            stack: error.stack,
            type: error.name
        });
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
