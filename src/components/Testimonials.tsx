import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, PhoneCall, Star, Globe, ShieldCheck, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  website?: string;
  email: string;
  phone: string;
  verified: boolean;
  created_at?: string;
}

interface FormInputs {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  website?: string;
  email: string;
  phone: string;
}

const renderStars = (rating: number) => (
  <div className="flex space-x-[2px]" aria-label={`Rating: ${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((i) => {
      const isFull = rating >= i;
      const isHalf = !isFull && rating >= i - 0.5;

      if (isFull) {
        return <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
      } else if (isHalf) {
        return (
          <div key={i} className="relative w-5 h-5">
            <Star className="text-slate-600 absolute top-0 left-0 w-5 h-5" />
            <div className="absolute top-0 left-0 w-2.5 h-5 overflow-hidden">
              <Star className="text-yellow-400 fill-yellow-400 w-5 h-5" />
            </div>
          </div>
        );
      } else {
        return <Star key={i} className="w-5 h-5 text-slate-600" />;
      }
    })}
  </div>
);

const Testimonials = () => {
  const [testimonialList, setTestimonialList] = useState<Testimonial[]>([]);
  const [visibleIndex, setVisibleIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormInputs>();

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "";
  }, [isModalOpen]);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching testimonials:", error);
    else setTestimonialList(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonialList.length <= 1) return;

    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % testimonialList.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [testimonialList]);

  const onSubmit = async (formData: FormInputs) => {
    const newTestimonial: Testimonial = {
      id: uuidv4(),
      ...formData,
      verified: false,
    };

    const { error } = await supabase.from("testimonials").insert([newTestimonial]);

    if (error) {
      alert("Failed to submit. Please try again.");
      console.error(error);
      return;
    }

    try {
      const formspreeData = new FormData();
      Object.entries(formData).forEach(([k, v]) =>
        formspreeData.append(k, String(v || ""))
      );

      await fetch("https://formspree.io/f/xnjkzkpg", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formspreeData,
      });
    } catch (err) {
      console.warn("Formspree submission failed:", err);
    }

    alert("Thank you! Your testimonial is pending verification.");
    reset();
    setIsModalOpen(false);
  };

  return (
    <section id="testimonials" className="px-4 py-20 bg-slate-800/30 overflow-x-hidden">
      <div className="mx-auto w-full max-w-6xl space-y-10">

        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            What Our{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-purple-400 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Real people, real results, real success stories. Hear from those who’ve worked with us.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto mt-4 px-6 py-2 duration-700 bg-gradient-to-r from-purple-400 via-purple-500 to-cyan-600 text-white hover:from-purple-700 hover:to-purple-400 hover:text-black rounded font-medium transition"
            aria-label="Open testimonial submission form"
          >
            Submit Your Testimonial
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-25 w-25 rounded-full animate-spin bg-gradient-to-r from-purple-400 via-purple-500 to-cyan-600 p-[2px] flex justify-center items-center">
              <div className="h-20 w-20 rounded-full bg-slate-800 flex justify-center items-center text-black font-bold no-spin">
                Loading...
              </div>
            </div>
          </div>
        ) : testimonialList.length === 0 ? (
          <p className="text-center text-slate-400">No testimonials yet.</p>
        ) : (
          <div className="w-full">
            <Card className="w-full bg-slate-700/10 border border-slate-600/20 hover:-translate-y-2 group overflow-hidden shadow-lg transition-all duration-700 ease-in-out">
              <CardContent className="p-6 sm:p-8 space-y-6 text-slate-300 break-words hyphens-auto">

                <div className="flex items-center gap-3">
                  {renderStars(testimonialList[visibleIndex].rating)}

                  {testimonialList[visibleIndex].verified && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck size={12} /> Verified
                    </span>
                  )}
                </div>

                <blockquote className="leading-relaxed text-base sm:text-lg md:text-xl">
                  “{testimonialList[visibleIndex].content}”
                </blockquote>

                <div className="border-t border-slate-600/20 pt-4">
                  <div className="text-center md:text-left mb-3">
                    <h4 className="font-semibold text-white text-lg">
                      {testimonialList[visibleIndex].name}
                    </h4>
                    <p className="text-slate-400 text-sm">
                      {testimonialList[visibleIndex].role}, {testimonialList[visibleIndex].company}
                    </p>
                  </div>

                  <div className="text-slate-400 text-sm space-y-1">
                    {testimonialList[visibleIndex].website && (
                      <p>
                        <Globe className="inline-block w-4 h-4 mr-2" />
                        <a
                          href={testimonialList[visibleIndex].website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-cyan-500 hover:underline duration-700"
                        >
                          {testimonialList[visibleIndex].website}
                        </a>
                      </p>
                    )}

                    <p>
                      <Mail className="inline-block w-4 h-4 mr-2" />
                      <a
                        href={`mailto:${testimonialList[visibleIndex].email}`}
                        className="text-slate-300 hover:text-cyan-500 hover:underline duration-700"
                      >
                        {testimonialList[visibleIndex].email}
                      </a>
                    </p>

                    <p>
                      <PhoneCall className="inline-block w-4 h-4 mr-2" />
                      <a
                        href={`tel:${testimonialList[visibleIndex].phone}`}
                        className="text-slate-300 hover:text-cyan-500 hover:underline duration-700"
                      >
                        {testimonialList[visibleIndex].phone}
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-purple-950/60 to-cyan-950/60 px-4">
            <div
              className="bg-black rounded-xl shadow-lg max-w-xl w-full p-6 relative max-h-[90vh] overflow-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <h3 id="modal-title" className="text-2xl font-semibold text-white mb-4 text-center">
                Submit Your Testimonial
              </h3>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <input {...register("name", { required: true })} disabled={isSubmitting} className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Your Name" />
                <input {...register("role", { required: true })} disabled={isSubmitting} className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Your Role" />
                <input {...register("company")} disabled={isSubmitting} className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Company" />
                <textarea {...register("content", { required: true })} disabled={isSubmitting} rows={4} className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Your Testimonial" />
                <input {...register("rating", { required: true, min: 1, max: 5 })} disabled={isSubmitting} type="number" min={1} max={5} className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Rating (1-5)" />
                <input {...register("website")} disabled={isSubmitting} className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Website (optional)" />
                <input {...register("email", { required: true })} disabled={isSubmitting} type="email" className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Email" />
                <input {...register("phone", { required: true })} disabled={isSubmitting} type="tel" className="w-full p-2 rounded bg-slate-800/30 text-white" placeholder="Phone" />
                <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-gradient-to-r from-purple-400 via-purple-500 to-cyan-600 duration-500 hover:from-purple-700 hover:to-purple-400 hover:text-black text-white rounded font-medium transition">
                  {isSubmitting ? "Submitting..." : "Submit Testimonial"}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default Testimonials;