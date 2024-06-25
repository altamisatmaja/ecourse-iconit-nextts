import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
// import { IconBadge } from '@/components/icon-badges';
import { IconBadge } from '../../../../../../components/icon-badges';
import { LayoutDashboard } from 'lucide-react';

const CourseIdPage = async ({
    params
} : {
    params: { courseId : string }
}) => {
    const { userId } = auth();

    if(!userId){
        return redirect('/');
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        }
    });

    if(!course){
        return redirect('/');
    }

    const requiredFields =[
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId
    ];

    const compeletedFields = requiredFields.filter(Boolean).length;
    const totalFields = requiredFields.length;

    const completionText = `(${compeletedFields} / ${totalFields})`

    return ( 
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h2 className="text-2xl font-medium">Rincian pembelajaran</h2>
                    <span className="text-sm text-slate-700">Progress pengisian {completionText}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge size="sm" icon={LayoutDashboard}/>
                        <h2 className="text-xl">
                            Kustom pembelajaran Anda!
                        </h2>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default CourseIdPage;