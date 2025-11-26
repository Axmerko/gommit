import { NextResponse } from "next/server";
import { prisma } from '@/lib/db'

export async function GET(){
    try {
        const lastLog = await prisma.golemLog.findFirst({
            orderBy:{
                createdAt: 'desc'
            }
        });

        const mood = lastLog?.mood || 'Idle';

        return NextResponse.json({mood});
    } catch (error) {
        return NextResponse.json({error: 'Chyba při čtení databáze'}, {status: 500});
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mood } = body;

        if (!mood) {
            return NextResponse.json({ error: 'Nálada chybí' }, { status: 400 });
        }


        const newLog = await prisma.golemLog.create({
            data: {
                mood: mood,
            },
        });

        return NextResponse.json(newLog);
    } catch (error) {
        return NextResponse.json({ error: 'Chyba při ukládání' }, { status: 500 });
    }
}