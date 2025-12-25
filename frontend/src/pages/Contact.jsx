import { useState } from "react";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Remove useToast since we are using AlertDialog
import { API_URL } from "@/lib/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    isSuccess: false,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const closeAlert = () => {
    setAlertConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setAlertConfig({
          isOpen: true,
          title: "✅ Message Sent Successfully!",
          description: "Thank you for reaching out. We have received your message and will get back to you shortly.",
          isSuccess: true
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setAlertConfig({
          isOpen: true,
          title: "❌ Message Not Sent",
          description: data.message || "Something went wrong. Please try again.",
          isSuccess: false
        });
      }
    } catch (error) {
      console.error(error);
      setAlertConfig({
        isOpen: true,
        title: "❌ Message Not Sent",
        description: "Network error. Please check your internet connection and try again.",
        isSuccess: false
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Alert Dialog */}
      <AlertDialog open={alertConfig.isOpen} onOpenChange={(open) => !open && closeAlert()}>
        <AlertDialogContent className="bg-card border-border rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className={alertConfig.isSuccess ? "text-green-500" : "text-destructive"}>
              {alertConfig.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground whitespace-pre-line text-base mt-2">
              {alertConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAlert} className={alertConfig.isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-destructive hover:bg-destructive/90"}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Hero */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions, feedback, or just want to say hello? We'd love to
              hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold mb-6">
                  Contact Information
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form or reach out directly through any of the
                  channels below.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a
                      href="mailto:hello@alphapodcast.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      hello@alphapodcast.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <a
                      href="tel:+1234567890"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      +91 7050308555
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-muted-foreground">
                      123 Podcast Street
                      <br />
                      San Francisco, CA 94102
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Live Chat</h3>
                    <p className="text-muted-foreground">
                      Available Mon-Fri, 9am-6pm PST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="glass-card p-8 rounded-2xl">
                <h2 className="font-display text-2xl font-bold mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    >
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                      placeholder="Tell us what's on your mind..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-display font-semibold mb-2">
                How do I create an account?
              </h3>
              <p className="text-muted-foreground text-sm">
                Simply click the Subscribe button and follow the prompts to
                create your free account.
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-display font-semibold mb-2">
                Is ALPHA Podcast platform free to use?
              </h3>
              <p className="text-muted-foreground text-sm">
                Yes! ALPHA Podcast platform is completely free. We offer a premium tier with
                additional features.
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-display font-semibold mb-2">
                How do I submit my podcast?
              </h3>
              <p className="text-muted-foreground text-sm">
                Contact us through the partnership option in the form above and
                we'll guide you through the process.
              </p>
            </div>
            <div className="glass-card p-6 rounded-xl">
              <h3 className="font-display font-semibold mb-2">
                Can I download episodes offline?
              </h3>
              <p className="text-muted-foreground text-sm">
                Premium subscribers can download episodes for offline listening
                on our mobile apps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;