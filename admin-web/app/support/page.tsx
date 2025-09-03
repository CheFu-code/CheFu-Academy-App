import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const Support = () => {
    const currentYear = new Date().getFullYear();

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold">Support</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
                We're here to help. Find answers to common questions or reach
                out to us directly.
            </p>

            <ScrollArea className="h-[400px] sm:h-[600px] border rounded-md p-3 sm:p-4">
                <div className="space-y-3 sm:space-y-4">
                    {/* FAQ Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">
                                Frequently Asked Questions
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="account">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How do I create an account?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Click on the Sign Up button on the
                                            homepage and follow the registration
                                            process. Provide a valid email
                                            address and create a strong
                                            password.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="payment">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How do I update my payment method?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            Navigate to your billing settings
                                            and select "Upgrade." You can add a
                                            new card or update existing
                                            information.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="subscription">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        How do I cancel my subscription?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            You don't need to manually cancel
                                            your subscription. Your access will
                                            continue until the end of your
                                            current billing period. After that,
                                            your account will be downgraded to
                                            the free plan.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="technical">
                                    <AccordionTrigger className="text-sm sm:text-base">
                                        Technical issues or bugs?
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-xs sm:text-sm text-muted-foreground">
                                            If you encounter any technical
                                            issues, please send a detailed
                                            description to chefu.inc@gmail.com
                                            and include screenshots if possible.
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    {/* Contact Support */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg sm:text-xl">
                                Contact Support
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                                If your question isn’t answered in the FAQ,
                                reach out to us directly:
                            </p>
                            <ul className="list-disc ml-5 space-y-1 text-xs sm:text-sm text-muted-foreground">
                                <li>
                                    Email:{" "}
                                    <a
                                        className="text-blue-600"
                                        href="mailto:chefu.inc@gmail.com"
                                    >
                                        chefu.inc@gmail.com
                                    </a>
                                </li>
                                <li>Phone: +27 (60) 603-1205</li>
                                <li>
                                    Live chat: Available in-app during business
                                    hours
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>

            <p className="text-xs sm:text-sm text-muted-foreground text-center">
                © {currentYear} CheFu Inc
            </p>
        </div>
    );
};

export default Support;
