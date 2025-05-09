'use client'

import { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { proofFormDataSchema } from '../_domain/types.editor'
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { ContractEditor } from './ContractEditor'
import { PlaintextEditor } from './PlaintextEditor'

const CONTRACT_EXAMPLE = `Owner: ...
Copyrights: ...`

export const Editor = memo((props) => {
    const form = useForm({
        resolver: zodResolver(proofFormDataSchema),
        mode: 'all',
        defaultValues: {
            contract: CONTRACT_EXAMPLE,
            plaintext: '',
            skipMap: '',
        },
    })

    return (
        <div className="flex items-center justify-center h-full">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((formData) => {})}
                    className="space-y-8"
                >
                    <Tabs
                        defaultValue="whatisit"
                        className="w-[calc(600rem/16)]"
                    >
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="whatisit">
                                What is this?
                            </TabsTrigger>
                            <TabsTrigger
                                value="binding"
                                disabled={!form.formState.isValid}
                            >
                                Binding
                            </TabsTrigger>
                            <TabsTrigger
                                value="writing"
                                disabled={!form.formState.isValid}
                            >
                                Write!
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="whatisit">
                            <Card>
                                <CardHeader>
                                    <CardTitle>What is this?</CardTitle>
                                    <CardDescription>
                                        A short story about an idea that
                                        probably sounds really dumb at first.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2"></CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="binding">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Define your binding</CardTitle>
                                    <CardDescription>
                                        Anything you write here will apply to
                                        the text you'll write in the next tab.
                                        Be creative!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <ContractEditor />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="writing">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Writing</CardTitle>
                                    <CardDescription>
                                        That's where the magic happens, you are
                                        one with the machine now... Let your
                                        imagination run wild!
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <PlaintextEditor />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </form>
            </Form>
        </div>
    )
})

Editor.displayName = 'Editor'
