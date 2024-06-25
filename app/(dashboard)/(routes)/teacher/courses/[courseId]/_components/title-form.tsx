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
    FormDescription,
    FormField,
    FormLabel,
    FormMessage,
    FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from 'react';

interface titleFormProps {
    initialData : {
        title: string;
    };
    courseId : string;
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: 'Title is required'
    }),
});

export const TitleForm = ({
    initialData,
    courseId
}: titleFormProps) => {
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState(initialData.title);

    const toggleEditing = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { title }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            console.log(response);
            toast.success("Pembelajaran berhasil diubah!");
            toggleEditing();
            router.refresh();
        } catch (error) {
            toast.error(`Terjadi kesalahan`);
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Judul pembelajaran
                <Button variant="ghost" onClick={toggleEditing}>
                    {isEditing ? (
                        <>
                            Cancel
                        </>
                    ) : (
                        <>
                            <Pencil className='h-4 w-4 mr-2'/>
                            Ubah nama
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className='text-sm p-2'>
                    {initialData.title}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                        control={form.control}
                        name="title"
                        render={({ field } ) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                    disabled={isSubmitting}
                                    placeholder="cth. Saham: Investasi Saham 101"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div>
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                                >
                                    Simpan
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}