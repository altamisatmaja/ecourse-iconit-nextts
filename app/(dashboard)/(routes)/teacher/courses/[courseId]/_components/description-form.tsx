"use client";

import { Pencil } from 'lucide-react';
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

interface DescriptionFormProps {
    initialData: {
        description: string;
    };
    courseId: string;
}

const formSchema = z.object({
    description: z.string().min(1, {
        message: 'Description is required'
    }),
});

export const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(initialData.description);

    const toggleEditing = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { description },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, { values });
            toast.success("Pembelajaran berhasil diubah!");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error("Terjadi kesalahan");
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Deskripsi pembelajaran
                <Button variant="ghost" onClick={toggleEditing}>
                    {isEditing ? "Cancel" : (<><Pencil className='h-4 w-4 mr-2'/>Ubah deskripsi</>)}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                    {initialData.description || "Tidak ada deskripsi"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="description"
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
