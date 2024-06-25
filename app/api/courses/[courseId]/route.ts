import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"
import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params } : { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params
        const { title } = await req.json();


        if (!userId){
            return new NextResponse(`Unauthoritized`, {status : 400});
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                title,
            }
        });

        console.log(course);

        return NextResponse.json(course);
    } catch (error) {
        console.log(`Terjadi kesalahan: ${error}`)
        return new NextResponse(`Internal Error`, {status : 500});
    }
}