"use client";

import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsData } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Plus, Pencil } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { createFaq, deleteFaq, updateFaq } from "@/actions";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const FaqsSettings = ({ data }: { data: SettingsData | null }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // form states
  const [faqId, setFaqId] = useState<string | null>(null);
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setFaqId(null);
    setTopic("");
    setQuestion("");
    setAnswer("");
    setIsActive(true);
  };

  const handleSubmitFaqs = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!question || !answer) {
        toast.error("Missing required fields.");
        return;
      }

      let response;
      if (faqId) {
        // update
        response = await updateFaq(faqId, topic, question, answer, isActive);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("FAQ updated successfully");
        }
      } else {
        // create
        response = await createFaq(topic, question, answer, isActive);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success("FAQ created successfully");
        }
      }

      router.refresh();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error("Failed to save FAQ");
    } finally {
      setLoading(false);
    }
  };

  // Group faqs by topic
  const groupedFaqs = data?.faqs?.reduce<Record<string, typeof data.faqs>>(
    (acc, faq) => {
      if (!acc[faq.topic]) acc[faq.topic] = [];
      acc[faq.topic].push(faq);
      return acc;
    },
    {}
  );

  const topics = groupedFaqs ? Object.keys(groupedFaqs) : [];

  return (
    <>
      {/* Create / Update FAQ Modal */}
      <Modal
        className="!max-w-4xl"
        title={faqId ? "Update FAQ" : "Create new FAQ"}
        description="Please fill all the required fields (*)"
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          resetForm();
        }}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>
              Topic <span className="text-destructive">*</span>
            </Label>
            <Select
              value={topic}
              onValueChange={(value) => setTopic(value)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Order Issues">Order Issues</SelectItem>
                <SelectItem value="Shipping & Delivery">
                  Shipping & Delivery
                </SelectItem>
                <SelectItem value="Return & Refund">Return & Refund</SelectItem>
                <SelectItem value="Product & Stock">Product & Stock</SelectItem>
                <SelectItem value="Managing Account">
                  Managing Account
                </SelectItem>
                <SelectItem value="Payment & Promos">
                  Payment & Promos
                </SelectItem>
                <SelectItem value="Security">Security</SelectItem>
                <SelectItem value="Policies & Others">
                  Policies & Others
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>
              Question <span className="text-destructive">*</span>
            </Label>
            <Input
              disabled={loading}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. How to search for items on 1 Market Philippines"
            />
          </div>
          <div className="space-y-2">
            <Label>
              Answer <span className="text-destructive">*</span>
            </Label>
            <RichTextEditor
              disabled={loading}
              value={answer}
              onChangeAction={setAnswer}
              placeholder="Enter your answer here..."
            />
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label htmlFor="faq-status">FAQ Visibility</Label>
              <p className="text-sm text-muted-foreground">
                Enable this option to display the question and answer on the
                public FAQ page.
              </p>
            </div>
            <Switch
              id="faq-status"
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={loading}
            />
          </div>
          <div className="mt-5 ml-auto flex items-center justify-end gap-2">
            <Button
              onClick={handleSubmitFaqs}
              disabled={loading}
              variant="primary"
            >
              {faqId ? "Update FAQ" : "Save Changes"}
            </Button>
            {faqId && (
              <Button
                variant="destructive"
                onClick={async () => {
                  if (confirm("Are you sure you want to delete this FAQ?")) {
                    const res = await deleteFaq(faqId);
                    if (res.error) {
                      toast.error(res.error);
                    } else {
                      toast.success("FAQ deleted successfully");
                      router.refresh();
                    }
                  }
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* FAQ Settings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-balance">
            FAQS Information
          </h1>
        </div>
        <Card className="rounded-sm">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardAction>
              <Button
                onClick={() => {
                  resetForm();
                  setIsOpen(true);
                }}
                size="sm"
              >
                <Plus className="size-4" />
                Add new faq
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {topics.length > 0 ? (
              <Tabs defaultValue={topics[0]} className="w-full">
                <TabsList className="flex flex-wrap">
                  {topics.map((topic) => (
                    <TabsTrigger key={topic} value={topic}>
                      {topic}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {topics.map((topic) => (
                  <TabsContent key={topic} value={topic} className="mt-4">
                    <Accordion type="single" collapsible>
                      {groupedFaqs?.[topic].map((faq, index) => (
                        <AccordionItem
                          key={faq.id ?? index}
                          value={`faq-${topic}-${index}`}
                        >
                          <AccordionTrigger className="hover:no-underline cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  faq.isActive ? "success" : "destructive"
                                }
                              >
                                {faq.isActive ? "Active" : "Not Active"}
                              </Badge>
                              {faq.question}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto"
                                onClick={() => {
                                  setFaqId(faq.id);
                                  setTopic(faq.topic);
                                  setQuestion(faq.question);
                                  setAnswer(faq.answer);
                                  setIsActive(faq.isActive);
                                  setIsOpen(true);
                                }}
                              >
                                <Pencil className="size-4" />
                              </Button>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div
                              className="prose prose-sm max-w-none
                                prose-headings:font-bold
                                prose-headings:text-black
                                prose-a:text-primary prose-a:underline
                                prose-ul:list-disc prose-ol:list-decimal
                                prose-li:marker:text-black"
                              dangerouslySetInnerHTML={{
                                __html: faq.answer,
                              }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <p className="text-muted-foreground">No FAQs available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default FaqsSettings;
