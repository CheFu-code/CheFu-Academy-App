import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaExclamationCircle } from "react-icons/fa";

const Terms = () => {
    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <h1 className="text-4xl font-extrabold">Terms of Service</h1>
            <p className="text-muted-foreground text-sm">
                Last updated: September 3, 2025
            </p>

            <ScrollArea className="h-[700px] border rounded-lg p-6">
                <div className="space-y-6">
                    {/* Introduction */}
                    <Card className="bg-gray-50 dark:bg-gray-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FaExclamationCircle className="text-blue-500" />
                                Introduction
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Welcome to our platform! By accessing or using
                                our services, you agree to comply with these
                                Terms of Service and all applicable laws. Please
                                read carefully. Using our platform indicates
                                acceptance of all provisions herein.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Account Terms */}
                    <Accordion type="single" collapsible>
                        <AccordionItem value="account">
                            <AccordionTrigger>
                                Account Registration & Responsibilities
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Users must provide accurate and up-to-date
                                    information when creating an account. You
                                    are responsible for maintaining the
                                    confidentiality of your login credentials.
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        Do not share your account with others.
                                    </li>
                                    <li>
                                        Notify us immediately of any
                                        unauthorized access.
                                    </li>
                                    <li>
                                        Ensure your password is strong and
                                        unique.
                                    </li>
                                    <li>
                                        Two-factor authentication is encouraged
                                        for extra security.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Usage Policy */}
                        <AccordionItem value="usage">
                            <AccordionTrigger>Usage Policy</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Users must not use the platform to:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        Engage in illegal activities or fraud.
                                    </li>
                                    <li>
                                        Upload harmful, offensive, or malicious
                                        content.
                                    </li>
                                    <li>
                                        Attempt unauthorized access to other
                                        users’ data.
                                    </li>
                                    <li>
                                        Disrupt, overload, or harm the
                                        platform’s services.
                                    </li>
                                    <li>
                                        Impersonate other users, staff, or third
                                        parties.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Subscription & Billing */}
                        <AccordionItem value="billing">
                            <AccordionTrigger>
                                Subscription & Billing
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Our services may include free and paid
                                    subscription tiers. Payment obligations are
                                    binding once a subscription is confirmed.
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        All payments are non-refundable unless
                                        explicitly stated.
                                    </li>
                                    <li>
                                        Prices may change with prior notice.
                                    </li>
                                    <li>
                                        Subscription cancellations take effect
                                        at the end of the billing period.
                                    </li>
                                    <li>
                                        Discounts and promotions may have
                                        special terms. Please review them
                                        carefully.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Privacy & Data */}
                        <AccordionItem value="privacy">
                            <AccordionTrigger>Privacy & Data</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    By using our services, you consent to the
                                    collection and use of your data according to
                                    our Privacy Policy.
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        We respect your privacy and will not
                                        sell your data.
                                    </li>
                                    <li>
                                        Data may be used to improve the service
                                        experience.
                                    </li>
                                    <li>
                                        We implement industry-standard security
                                        measures to protect your data.
                                    </li>
                                    <li>
                                        Cookies and analytics may be used to
                                        enhance your experience.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Termination */}
                        <AccordionItem value="termination">
                            <AccordionTrigger>Termination</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    We may suspend or terminate accounts for
                                    violations of these Terms or legal reasons.
                                    Termination does not release you from
                                    obligations incurred prior to termination.
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Users may request account deletion, which
                                    will remove personal data within the limits
                                    required by law.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Liability */}
                        <AccordionItem value="liability">
                            <AccordionTrigger>
                                Limitation of Liability
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    To the maximum extent permitted by law, we
                                    are not liable for:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        Direct or indirect damages arising from
                                        the use of our services.
                                    </li>
                                    <li>
                                        Data loss, downtime, or service
                                        interruptions.
                                    </li>
                                    <li>
                                        Third-party content, links, or services
                                        integrated in the platform.
                                    </li>
                                    <li>
                                        Loss of profits, goodwill, or other
                                        consequential damages.
                                    </li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Changes */}
                        <AccordionItem value="changes">
                            <AccordionTrigger>
                                Changes to Terms
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                    We may update these Terms at any time. Users
                                    will be notified of material changes.
                                    Continued use of our services constitutes
                                    acceptance of the updated Terms.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Contact */}
                        <AccordionItem value="contact">
                            <AccordionTrigger>
                                Contact Information
                            </AccordionTrigger>
                            <AccordionContent>
                                <p className="text-sm text-muted-foreground mb-2">
                                    For questions about these Terms or our
                                    services, please contact us:
                                </p>
                                <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                                    <li>
                                        Email:{" "}
                                        <a
                                            href="mailto:chefu.inc@gmail.com"
                                            className="underline text-blue-500"
                                        >
                                            chefu.inc@gmail.com
                                        </a>
                                    </li>
                                    <li>Phone: +27 (60) 603-1205</li>
                                    <li>
                                        Address: 145 CheFu&apos;s Street, Dinga,
                                        South Africa
                                    </li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-2">
                                    We aim to respond within 2 business days.
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Footer Note */}
                    <p className="text-xs text-center text-muted-foreground mt-4">
                        © {new Date().getFullYear()} CheFu Inc. All rights
                        reserved. Using this platform indicates agreement with
                        these Terms of Service.
                    </p>
                </div>
            </ScrollArea>
        </div>
    );
};

export default Terms;
