import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"
import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId){
            return new NextResponse(`Unauthoritized`, {status : 400});
        }

        const course =  await db.course.create({
            data: {
                userId,
                title,
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log(`Terjadi kesalahan: ${error}`)
        return new NextResponse(`Internal Error`, {status : 500});
    }
}