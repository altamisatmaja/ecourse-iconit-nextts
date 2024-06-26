"use client";

import { Pencil, PlusCircle, ImageIcon } from 'lucide-react';
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
    Form,
    FormControl,
    FormMessage,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Course } from '@prisma/client';

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
    const [description, setDescription] = useState(initialData.description);

    const toggleEditing = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { imageUrl: initialData?.imageUrl || "" },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, { values });
            toast.success("Gambar pembelajaran berhasil diubah!");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error("Terjadi kesalahan");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Gambar pembelajaran
                <Button variant="ghost" onClick={toggleEditing}>
                    { isEditing && (
                        <>"Cancel"</>
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
                    <div>
                        Gambar awal
                    </div>
                )
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="cth. 'Hal yang akan dipelajari di pembelajaran ini...'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <Button disabled={!isValid || isSubmitting} type="submit">Simpan</Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};
