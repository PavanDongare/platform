'use client'

import { Linkedin, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sunkari Nirmal',
    role: 'Senior Manager - Data COE, Publicis Sapient II Ex-Head - Digital Analytics, Spencer's Ecommerce II Co-founder, Ask Analytics',
    url: 'https://www.linkedin.com/in/sunkari-nirmal-9b48016/',
    date: 'May 14, 2025',
    content: [
      'Had the opportunity to work with Pavan for close to a year. Pavan was clinical and his hands-on approach helped us turnaround many complex briefs. Pavan’s greatest strength is his clear vision and focus on long term goals. This set him apart from many of his peers and drive greater value.',
      'It was remarkable to see him continuously x-skill, staying curious and experimenting with new ideas. This was especially true for the compliance domain where Pavan was responsible for critical, time bound deliverables. His tireless efforts and proactive approach proved valuable for the organisation.',
      'The fast evolving tech landscape is a perfect place for Pavan, given his knack for building new skills and keenness to execute and scale complex solutions'
    ]
  },
  {
    name: 'Oliver MacPherson',
    role: 'COO at Neem Consulting, COO and Board Member at Opteca',
    url: 'https://www.linkedin.com/in/olimac/',
    date: 'April 10, 2025',
    content: [
      'Pavan has done a fantastic job for Neem Consulting at one of our largest clients, Unilever. He led a significant compliance overhaul for Unilever, improving cookie consent compliance from 13% to 96% across 1,000+ websites. His expertise in product management, regulatory compliance, and digital governance is exceptional.',
      'Pavan's technical skills, combined with his ability to lead teams and drive results, make him an invaluable asset to any organisation. I highly recommend Pavan for his dedication, innovation, and ability to solve complex problems through technology.'
    ]
  },
  {
    name: 'Andrew Ward - MBA - Cert Mgmt- FIDM-FCMI-SPOAC',
    role: 'I help companies grow 📈 | Experiential transformation consultant | 20 years' experience | 'Swiss Army knife NED' | Multi-disciplinary analysis 🕵️‍♀️ → Strategic tool selection 🛠️ → Founder success 🏆',
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
            <p className="text-zinc-400 text-xs uppercase tracking-widest mb-2">Recommendations</p>
            <h2 className="text-3xl font-medium tracking-tight text-zinc-900 italic">"Touch Only"</h2>
          </div>
          <Quote className="w-8 h-8 text-zinc-100 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div 
              key={idx} 
              className="group relative bg-white border border-zinc-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row"
            >
              {/* LinkedIn Style Left Bar */}
              <div className="w-full md:w-1 bg-zinc-50 group-hover:bg-zinc-900 transition-colors" />
              
              <div className="flex-1 p-6 md:p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="relative w-12 h-12 rounded-full bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-900 hover:text-blue-700 transition-colors cursor-pointer">
                        <a href={testimonial.url} target="_blank" rel="noopener noreferrer">
                          {testimonial.name}
                        </a>
                      </h3>
                      <p className="text-sm text-zinc-500 line-clamp-2 max-w-xl">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {testimonial.date}
                      </p>
                    </div>
                  </div>
                  <a 
                    href={testimonial.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-[#0A66C2] transition-colors"
                  >
                    <Linkedin className="w-6 h-6 fill-current" />
                  </a>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {testimonial.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-zinc-600 leading-relaxed text-[15px]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Footer Style Decoration */}
                <div className="mt-8 pt-6 border-t border-zinc-50 flex items-center gap-4">
                  <div className="text-[13px] text-zinc-400">
                    LinkedIn Verified Recommendation
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
