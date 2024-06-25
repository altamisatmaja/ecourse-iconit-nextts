import { db } from '@/lib/db';

const CourseIdPage = async ({
    params
} : {
    params: { courseId : string }
}) => {
    return ( 
        <div>
            Course id page { params.courseId }
        </div>
     );
}
 
export default CourseIdPage;