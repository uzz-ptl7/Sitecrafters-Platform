import { Mail, Phone, MapPin, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface ContactProps {
  selectedPlan: string;
}

type ToastType = "success" | "error";

const Contact: React.FC<ContactProps> = ({ selectedPlan }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [toast, setToast] = useState<{
    visible: boolean;
    type: ToastType;
    message: string;
  }>({
    visible: false,
    type: "success",
    message: ""
  });

  useEffect(() => {
    if (!toast.visible) return;

    const timer = setTimeout(() => {
      setToast((t) => ({ ...t, visible: false }));
    }, 12000);

    return () => clearTimeout(timer);
  }, [toast.visible]);

  const showToast = (type: ToastType, message: string) => {
    setToast({
      visible: true,
      type,
      message
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast("error", "Please complete all required fields.");
      return;
    }

    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("message", message);
    form.append("selectedPlan", selectedPlan);

    try {
      const response = await fetch("https://formspree.io/f/mnnvokkw", {
        method: "POST",
        body: form,
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        showToast("success", "Message sent successfully. We will respond soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        showToast("error", "Submission failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Network error. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">

          {/* HEADER */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get In{" "}
              <span className="bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                Touch
              </span>
            </h2>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Start your project journey — we’ll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

            {/* CONTACT INFO */}
            <div className="space-y-8">

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 flex items-center gap-4">
                <Mail className="w-6 h-6 text-cyan-400" />
                <div>
                  <h3 className="text-white font-semibold">Email</h3>
                  <a
                    href="mailto:sitecraftersltd@gmail.com"
                    className="text-slate-300 hover:text-cyan-400"
                  >
                    sitecraftersltd@gmail.com
                  </a>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 flex items-center gap-4">
                <Phone className="w-6 h-6 text-purple-400" />
                <div>
                  <h3 className="text-white font-semibold">Phone</h3>
                  <a
                    href="tel:250789599719"
                    className="text-slate-300 hover:text-cyan-400"
                  >
                    (+250) 789-599-719
                  </a>
                </div>
              </div>

              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 flex items-center gap-4">
                <MapPin className="w-6 h-6 text-green-400" />
                <div>
                  <h3 className="text-white font-semibold">Location</h3>
                  <p className="text-slate-300">Kigali, Rwanda</p>
                </div>
              </div>

            </div>

            {/* FORM */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* NAME */}
                <div>
                  <label className="block text-white mb-2">Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-slate-700/40 p-3 rounded text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-white mb-2">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full bg-slate-700/40 p-3 rounded text-white outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>

                {/* MESSAGE */}
                <div>
                  <label className="block text-white mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    rows={5}
                    className="w-full bg-slate-700/40 p-3 rounded text-white outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5" />
                </Button>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* TOAST */}
      {toast.visible && (
        <div
          role="alert"
          className={`fixed bottom-4 right-4 z-50 p-4 rounded-lg border shadow-lg flex items-start gap-4 max-w-sm
            ${toast.type === "success"
              ? "bg-black border-green-600 text-green-400"
              : "bg-black border-red-600 text-red-400"
            }
          `}
        >
          <p className="text-sm">{toast.message}</p>

          <button
            onClick={() => setToast((t) => ({ ...t, visible: false }))}
            aria-label="Close notification"
            className="p-1 hover:bg-slate-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default Contact;