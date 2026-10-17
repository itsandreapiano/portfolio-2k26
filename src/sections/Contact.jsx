"use client";

import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/Button";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import Link from "next/link";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "itsandreapiano@gmail.com",
    href: "mailto:itsandreapiano@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+48 600 967 307",
    href: "tel:+48600967307",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Poznań, Poland",
    href: null,
  },
];

// Validation rules
const validationRules = {
  name: /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]+$/u,
  company: /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s.,&'’()/-]*$/u,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  message: /^[\s\S]{10,}$/,
};

const validateForm = (data) => {
  const errors = {};

  const name = data.name.trim();
  const company = data.company.trim();
  const email = data.email.trim();
  const message = data.message.trim();

  if (!validationRules.name.test(name)) {
    errors.name = "Name must contain at least 2 valid characters.";
  }

  if (company && !validationRules.company.test(company)) {
    errors.company = "Please enter a valid company name.";
  }

  if (!validationRules.email.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!validationRules.message.test(message)) {
    errors.message = "Message must contain at least 10 characters.";
  }

  return errors;
};

const inputClasses =
  "w-full px-4 py-3 bg-surface rounded-xl border outline-none transition-all focus:ring-1 focus:ring-primary disabled:cursor-not-allowed";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submitStatus, setSubmitStatus] = useState({
    type: null,
    message: "",
  });

  const submissionInProgress = useRef(false);
  const submissionCompleted = useRef(false);

  const isFormDisabled = isLoading || isSubmitted;

  const handleChange = (field, value) => {
    if (submissionInProgress.current || submissionCompleted.current) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submissionInProgress.current || submissionCompleted.current) {
      return;
    }

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    submissionInProgress.current = true;

    setErrors({});
    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;

      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

      const confirmationTemplateId =
        process.env.NEXT_PUBLIC_EMAILJS_CONFIRMATION_TEMPLATE_ID;

      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS configuration is missing.");
      }

      const templateParams = {
        name: formData.name.trim(),
        company: formData.company.trim() || "Not provided",
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      // Send the message to your inbox
      await emailjs.send(serviceId, templateId, templateParams, { publicKey });

      // Lock the form after successful submission
      submissionCompleted.current = true;
      setIsSubmitted(true);

      setSubmitStatus({
        type: "success",
        message: "Message sent! I'll be in touch soon.",
      });

      // Send automatic confirmation to the visitor
      if (confirmationTemplateId) {
        try {
          await emailjs.send(
            serviceId,
            confirmationTemplateId,
            templateParams,
            { publicKey },
          );
        } catch (confirmationError) {
          console.error("Confirmation email failed:", confirmationError);
        }
      }
    } catch (error) {
      console.error("EmailJS error:", error);

      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      submissionInProgress.current = false;
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-highlight/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase animate-fade-in">
            Get In Touch
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6 animate-fade-in animation-delay-100 text-primary">
            Let's make it{" "}
            <span className="font-serif italic font-normal text-white">
              happen.
            </span>
          </h2>

          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            Open to remote opportunities across Europe. Let's connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="glass p-8 rounded-3xl border border-primary/30 animate-fade-in animation-delay-300">
            <form
              className="space-y-6"
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
            >
              <fieldset
                disabled={isFormDisabled}
                className="space-y-6 min-w-0 disabled:opacity-60"
              >
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Name
                  </label>

                  <input
                    id="name"
                    name="contact_full_name"
                    type="text"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Your name..."
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={`${inputClasses} ${
                      errors.name
                        ? "border-red-500"
                        : "border-border focus:border-primary"
                    }`}
                  />

                  {errors.name && (
                    <p id="name-error" className="text-red-400 text-xs mt-2">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Company - Optional */}
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium mb-2"
                  >
                    Company{" "}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="company"
                    name="contact_company"
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Your company..."
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    aria-invalid={!!errors.company}
                    aria-describedby={
                      errors.company ? "company-error" : undefined
                    }
                    className={`${inputClasses} ${
                      errors.company
                        ? "border-red-500"
                        : "border-border focus:border-primary"
                    }`}
                  />

                  {errors.company && (
                    <p id="company-error" className="text-red-400 text-xs mt-2">
                      {errors.company}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="contact_email_address"
                    type="email"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`${inputClasses} ${
                      errors.email
                        ? "border-red-500"
                        : "border-border focus:border-primary"
                    }`}
                  />

                  {errors.email && (
                    <p id="email-error" className="text-red-400 text-xs mt-2">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="contact_message"
                    rows={5}
                    required
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    aria-invalid={!!errors.message}
                    aria-describedby={
                      errors.message ? "message-error" : undefined
                    }
                    className={`${inputClasses} resize-none ${
                      errors.message
                        ? "border-red-500"
                        : "border-border focus:border-primary"
                    }`}
                  />

                  {errors.message && (
                    <p id="message-error" className="text-red-400 text-xs mt-2">
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                {!isSubmitted && (
                  <Button
                    className="w-full"
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                )}
              </fieldset>

              {/* Submission Status */}
              {submitStatus.type && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`flex items-center gap-3 p-4 rounded-xl ${
                    submitStatus.type === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}

                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in animation-delay-400">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const content = (
                    <>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          {item.label}
                        </div>
                        <div className="font-medium">{item.value}</div>
                      </div>
                    </>
                  );

                  return item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface transition-colors group"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      key={item.label}
                      className="flex items-center gap-4 p-4 rounded-xl group"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Availability Card */}
            <div className="glass rounded-3xl p-8 border border-primary/30">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 bg-analytics rounded-full animate-pulse" />
                <span className="font-medium">Currently Available</span>
              </div>

              <p className="text-muted-foreground text-sm">
                I'm open to new opportunities, exciting projects, and
                collaborations. Whether you're looking for a full-time
                professional or a freelance consultant, let's talk!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
