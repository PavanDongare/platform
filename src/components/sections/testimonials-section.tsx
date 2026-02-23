'use client'

import { Linkedin, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Oliver MacPherson',
    role: 'COO at Neem Consulting, COO and Board Member at Opteca',
    url: 'https://www.linkedin.com/in/olimac/',
    date: 'April 10, 2025',
    content: [
      'Pavan has done a fantastic job for Neem Consulting at one of our largest clients, Unilever. He led a significant compliance overhaul for Unilever, improving cookie consent compliance from 13% to 96% across 1,000+ websites. His expertise in product management, regulatory compliance, and digital governance is exceptional.',
      "Pavan's technical skills, combined with his ability to lead teams and drive results, make him an invaluable asset to any organisation. I highly recommend Pavan for his dedication, innovation, and ability to solve complex problems through technology."
    ]
  },
  {
    name: 'Jens Geisler',
    role: 'Digital Governance Lead Germany, Austria, Swiss and Poland',
    url: 'https://www.linkedin.com/in/jensgeisler/',
    date: 'March 12, 2025',
    content: [
      'Mr. Dongare, I am honestly want to thank you for your high engament in a challenging project with Unilever. I am so glad you where there as a competent partner for the Onetrust roleout. Its worth mentioning that I was allways impressed how flexble you are, even with moving targets, to deliver in timet, I also experianced you as very responsive to my asks.',
      'I am impressed how fast you gathering and build up special expertise for Onetrust and European Data Privacy rules with the consent demands for Websited. With all the obstacles and scope changes, i am happy to say: we done the project in time and scope. I would also like to point out that this cooperation was the best experiance with indian support Teams i ever had so far. Thanks agian.',
      'On the personal site I would also recommend you as a very friendly and open person. I guess, if not separated by half of the globe, we would also would have a couple of Koffee together in our free time. I would recommend Mr. Dongare without any reservation.'
    ]
  },
  {
    name: 'Sunkari Nirmal',
    role: "Senior Manager - Data COE, Publicis Sapient II Ex-Head - Digital Analytics, Spencer's Ecommerce II Co-founder, Ask Analytics",
    url: 'https://www.linkedin.com/in/sunkari-nirmal-9b48016/',
    date: 'May 14, 2025',
    content: [
      'Had the opportunity to work with Pavan for close to a year. Pavan was clinical and his hands-on approach helped us turnaround many complex briefs. Pavan’s greatest strength is his clear vision and focus on long term goals. This set him apart from many of his peers and drive greater value.',
      'It was remarkable to see him continuously x-skill, staying curious and experimenting with new ideas. This was especially true for the compliance domain where Pavan was responsible for critical, time bound deliverables. His tireless efforts and proactive approach proved valuable for the organisation.',
      'The fast evolving tech landscape is a perfect place for Pavan, given his knack for building new skills and keenness to execute and scale complex solutions'
    ]
  },
  {
    name: 'Andrew Ward - MBA - Cert Mgmt- FIDM-FCMI-SPOAC',
    role: "I help companies grow 📈 | Experiential transformation consultant | 20 years' experience | 'Swiss Army knife NED' | Multi-disciplinary analysis 🕵️‍♀️ → Strategic tool selection 🛠️ → Founder success 🏆",
    url: 'https://www.linkedin.com/in/banathe/',
    date: 'March 12, 2025',
    content: [
      'I had the pleasure of working closely with Pavan on multiple projects related to cookies, pixels, and consent management, where he played a critical role as a Product Owner in the Consent Management team. While I focused on regulatory frameworks and compliance requirements, Pavan was responsible for leading the technical implementation, ensuring that changes were executed efficiently and aligned with industry best practices.',
      'Pavan’s deep expertise in consent management technologies was invaluable in bringing our governance and privacy requirements to life. He worked hands-on with engineering teams, guiding the deployment of solutions across complex digital ecosystems and ensuring smooth, compliant implementations. His ability to troubleshoot challenges, adapt to evolving privacy requirements, and deliver scalable, high-quality solutions made him a key contributor to our success.',
      'Beyond his technical proficiency, Pavan is an exceptional team leader and collaborator. He worked well to deliver sustainable solutions. His structured approach to problem-solving and his commitment to high standards ensured that our implementations were both technically sound and aligned with business needs.',
      'For any organisation looking for a dedicated, detail-oriented Product Owner with hands-on experience in consent management and privacy technology, I highly recommend Pavan.'
    ]
  },
  {
    name: 'Navaneeth Kishore',
    role: 'Senior Software Engineer | Backend Engineering | Distributed Systems',
    url: 'https://www.linkedin.com/in/navaneeth-kishore/',
    date: 'December 11, 2022',
    content: [
      'Pavan brings a combination of innate product sense & strong background in technology. His deep understanding of user data, software development, and technical architecture allows him to uniquely add value.'
    ]
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-8 md:px-16 lg:px-24 bg-white border-b border-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Social Proof</p>
            <h2 className="text-3xl font-medium tracking-tight text-zinc-900">Professional Recommendations</h2>
          </div>
          <Quote className="w-8 h-8 text-zinc-100 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 text-sm">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-zinc-900 group-hover:text-[#0A66C2] transition-colors text-sm truncate max-w-[150px]">
                        <a href={testimonial.url} target="_blank" rel="noopener noreferrer">
                          {testimonial.name}
                        </a>
                      </h3>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-tight mt-0.5">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={testimonial.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] flex-shrink-0"
                  >
                    <Linkedin className="w-4 h-4 fill-current" />
                  </a>
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1">
                  {testimonial.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-zinc-600 leading-snug text-[13px]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Footer Style Decoration */}
                <div className="mt-5 pt-3 border-t border-zinc-50 flex items-center justify-between mt-auto">
                  <div className="text-[10px] font-medium text-[#0A66C2] flex items-center gap-1">
                    <Linkedin className="w-2.5 h-2.5 fill-current" />
                    LinkedIn Verified
                  </div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider">
                    {testimonial.date.split(',')[1]?.trim() || testimonial.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
