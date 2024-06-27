"use client";

import { Pencil, PlusCircle, ImageIcon, Upload } from 'lucide-react';
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { Course } from '@prisma/client';
import { FileUpload } from '../../../../../../../components/file-upload';

interface ImageFormProps {
    initialData: Course;
    courseId: string;
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: 'Image is required'
    }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { imageUrl: initialData?.imageUrl || "" },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, { values });
            toast.success("Gambar pembelajaran berhasil diubah!");
            toggleEditing();
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error(`Terjadi kesalahan: ${error}`);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Gambar pembelajaran
                <Button variant="ghost" onClick={toggleEditing}>
                    { isEditing && (
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl && (
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Tambah gambar
                        </>
                    ) }
                    {!isEditing && initialData.imageUrl && (
                    <><Pencil className='h-4 w-4 mr-2'/>Ubah gambar</>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className='h-10 w-10 text-slate-500'/>
                    </div>
                ) : 
                (
                    <div className="relative aspect-video mt-2">
                        <Image
                        alt="Upload"
                        fill
                        className="object-cover rounded-md"
                        src={initialData.imageUrl}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div>
                    <FileUpload
                    endpoint="courseImage"
                    onChange={(url) => {
                        if (url){
                            onSubmit({ imageUrl: url });
                        }
                    }}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        16:9 Rekomendasi aspek rasio
                    </div>
                </div>
            )}
        </div>
    );
};
