import { useState } from "react";
import { MessageCircleHeart } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import useUser from "@/provider/userContext/useUserContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { addFeedback } from "@/api/feedback";

interface IFormInputs {
  feedback: string;
}

const FeedbackModal = () => {
  const { idToken, user } = useUser();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    if (!idToken || !user?.email) {
      setSubmitStatus("Please log in to provide feedback.");
      return;
    }

    try {
      setIsSubmitting(true);
      await addFeedback(idToken, user.email, data.feedback);
      setSubmitStatus("Feedback successfully submitted. Thank you!");
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      setSubmitStatus(
        "An error occurred while submitting your feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row justify-start items-center cursor-pointer">
          <MessageCircleHeart className="h-4" />
          <span className="block">{`We'd Love Your Feedback!`}</span>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Your Thoughts Matter to Us!</DialogTitle>
          <DialogDescription>
            Help us shape the future of our product! Share what features you
            dream of seeing next.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-sm flex flex-col gap-2">
            <Textarea
              placeholder="Share your ideas or experiences here. Every bit of feedback is valuable to us."
              id="feedback"
              {...register("feedback", {
                required:
                  "Your feedback is important to us, please don't leave this blank.",
              })}
            />
            {errors.feedback && (
              <span className="text-red-500">{errors.feedback.message}</span>
            )}
          </div>
          {submitStatus && <div className=" text-sm mt-1">{submitStatus}</div>}
          <Button type="submit" className="mt-4" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Send Feedback"}{" "}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
