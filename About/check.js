
    const STACK = [
      { cat: 'CORE', name: 'HTML / CSS', level: 5 },
      { cat: 'CORE', name: 'Vanilla JS', level: 5 },
      { cat: 'GRAPHICS', name: 'WebGL2 / GLSL', level: 4 },
      { cat: 'ANIMATION', name: 'GSAP', level: 5 },
      { cat: 'ANIMATION', name: 'Lenis', level: 4 },
      { cat: 'BACKEND', name: 'Node.js / Express', level: 4 },
      { cat: 'BACKEND', name: 'WebSockets', level: 3 },
      { cat: 'INFRA', name: 'GitHub Pages', level: 5 },
      { cat: 'TOOLS', name: 'Git', level: 4 },
      { cat: 'AI', name: 'Anthropic API', level: 3 },
    ];

    const CATEGORIES = {
      "cyber": {
            "label": "Cybersecurity & Networking",
            "code": "CY",
            "color": "var(--accent)",
            "glow": "var(--accent-glow)",
            "chip": "SECURITY"
      },
      "web": {
            "label": "Web Development",
            "code": "WD",
            "color": "var(--ink-blue)",
            "glow": "var(--ink-blue-glow)",
            "chip": "BUILD"
      },
      "data": {
            "label": "Data / AI",
            "code": "DA",
            "color": "var(--ink-green)",
            "glow": "var(--ink-green-glow)",
            "chip": "DATA"
      },
      "core": {
            "label": "Core IT / Communication",
            "code": "CR",
            "color": "var(--text-sec)",
            "glow": "rgba(92,88,77,0.12)",
            "chip": "CORE"
      }
};
    const CATEGORY_ORDER = ['cyber', 'web', 'data', 'core'];

    const CREDENTIALS = [
      {
            "issuer": "Cisco Networking Academy",
            "title": "English for IT 1",
            "date": "14 Apr 2025",
            "dateSort": "20250414",
            "dateISO": "2025-04-14",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_0e22139e-919d-475b-add7-023185209f85.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_0e22139e-919d-475b-add7-023185209f85.pdf",
            "file": "_certificate_francistarectican47-gmail-com_0e22139e-919d-475b-add7-023185209f85.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Network Addressing and Basic Troubleshooting",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_19397fb9-fa9c-4319-8b66-c515d03703fc.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_19397fb9-fa9c-4319-8b66-c515d03703fc.pdf",
            "file": "_certificate_francistarectican47-gmail-com_19397fb9-fa9c-4319-8b66-c515d03703fc.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Create Digital Content, Communicate and Collaborate Online",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_57720270-c8b9-479c-86ac-b61719647a5c.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_57720270-c8b9-479c-86ac-b61719647a5c.pdf",
            "file": "_certificate_francistarectican47-gmail-com_57720270-c8b9-479c-86ac-b61719647a5c.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Endpoint Security",
            "date": "15 Apr 2025",
            "dateSort": "20250415",
            "dateISO": "2025-04-15",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_5bbc4858-4c66-4ccb-8a30-c227a1ad79c3.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_5bbc4858-4c66-4ccb-8a30-c227a1ad79c3.pdf",
            "file": "_certificate_francistarectican47-gmail-com_5bbc4858-4c66-4ccb-8a30-c227a1ad79c3.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Introduction to Data Science",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "data",
            "badge": "ANALYZED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_5eb80dba-b597-4330-b189-eceec9ab2bb8.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_5eb80dba-b597-4330-b189-eceec9ab2bb8.pdf",
            "file": "_certificate_francistarectican47-gmail-com_5eb80dba-b597-4330-b189-eceec9ab2bb8.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Introduction to Cybersecurity",
            "date": "14 Apr 2025",
            "dateSort": "20250414",
            "dateISO": "2025-04-14",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_623f48c5-6f56-4760-903d-6e472265c413.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_623f48c5-6f56-4760-903d-6e472265c413.pdf",
            "file": "_certificate_francistarectican47-gmail-com_623f48c5-6f56-4760-903d-6e472265c413.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Digital Awareness",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_6a0f67c7-5645-44d2-8b08-3fb962f596f3.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_6a0f67c7-5645-44d2-8b08-3fb962f596f3.pdf",
            "file": "_certificate_francistarectican47-gmail-com_6a0f67c7-5645-44d2-8b08-3fb962f596f3.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "JavaScript Essentials 2",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "web",
            "badge": "BUILT",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_6e76a878-a211-4128-ac42-50a45da15b84.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_6e76a878-a211-4128-ac42-50a45da15b84.pdf",
            "file": "_certificate_francistarectican47-gmail-com_6e76a878-a211-4128-ac42-50a45da15b84.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Python Essentials 2",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "web",
            "badge": "BUILT",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_73d4b017-2631-4282-b0f3-d8ded0e36a01.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_73d4b017-2631-4282-b0f3-d8ded0e36a01.pdf",
            "file": "_certificate_francistarectican47-gmail-com_73d4b017-2631-4282-b0f3-d8ded0e36a01.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Introduction to IoT and Digital Transformation",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "data",
            "badge": "ANALYZED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_74a10dc9-217c-42ba-8438-ad7994c6adfb.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_74a10dc9-217c-42ba-8438-ad7994c6adfb.pdf",
            "file": "_certificate_francistarectican47-gmail-com_74a10dc9-217c-42ba-8438-ad7994c6adfb.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Ethical Hacker",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_7567da3a-d008-4e15-9c8b-ccbdc6b50b6a.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_7567da3a-d008-4e15-9c8b-ccbdc6b50b6a.pdf",
            "file": "_certificate_francistarectican47-gmail-com_7567da3a-d008-4e15-9c8b-ccbdc6b50b6a.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Cyber Threat Management",
            "date": "15 Apr 2025",
            "dateSort": "20250415",
            "dateISO": "2025-04-15",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_7a622f7b-8b6b-4f62-a73a-0ab16a8a5ea7.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_7a622f7b-8b6b-4f62-a73a-0ab16a8a5ea7.pdf",
            "file": "_certificate_francistarectican47-gmail-com_7a622f7b-8b6b-4f62-a73a-0ab16a8a5ea7.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "JavaScript Essentials 1",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "web",
            "badge": "BUILT",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_7c489afd-3532-4d31-ad8e-900da6701d77.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_7c489afd-3532-4d31-ad8e-900da6701d77.pdf",
            "file": "_certificate_francistarectican47-gmail-com_7c489afd-3532-4d31-ad8e-900da6701d77.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Operating Systems Basics",
            "date": "14 Apr 2025",
            "dateSort": "20250414",
            "dateISO": "2025-04-14",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_823ba21f-cc7a-4d52-91f1-20bc6f07cb17.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_823ba21f-cc7a-4d52-91f1-20bc6f07cb17.pdf",
            "file": "_certificate_francistarectican47-gmail-com_823ba21f-cc7a-4d52-91f1-20bc6f07cb17.pdf"
      },
      {
            "issuer": "DICT-ITU DTC Initiative",
            "title": "CSS Essentials",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "web",
            "badge": "BUILT",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_859a2cf8-eb70-4c6f-b8e0-3617b1d48ae0.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_859a2cf8-eb70-4c6f-b8e0-3617b1d48ae0.pdf",
            "file": "_certificate_francistarectican47-gmail-com_859a2cf8-eb70-4c6f-b8e0-3617b1d48ae0.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Digital Safety and Security Awareness",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_88fdd2c8-dc7c-440b-9f96-71fc5f29e747.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_88fdd2c8-dc7c-440b-9f96-71fc5f29e747.pdf",
            "file": "_certificate_francistarectican47-gmail-com_88fdd2c8-dc7c-440b-9f96-71fc5f29e747.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "HTML Essentials",
            "date": "16 Apr 2025",
            "dateSort": "20250416",
            "dateISO": "2025-04-16",
            "category": "web",
            "badge": "BUILT",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_8aa4e1e7-a2be-41ca-8504-234352eb7d64.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_8aa4e1e7-a2be-41ca-8504-234352eb7d64.pdf",
            "file": "_certificate_francistarectican47-gmail-com_8aa4e1e7-a2be-41ca-8504-234352eb7d64.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Networking Basics",
            "date": "15 Apr 2025",
            "dateSort": "20250415",
            "dateISO": "2025-04-15",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_8ad0fb6e-a348-42a0-a223-b61f5a8d7927.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_8ad0fb6e-a348-42a0-a223-b61f5a8d7927.pdf",
            "file": "_certificate_francistarectican47-gmail-com_8ad0fb6e-a348-42a0-a223-b61f5a8d7927.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Computer Hardware Basics",
            "date": "14 Apr 2025",
            "dateSort": "20250414",
            "dateISO": "2025-04-14",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_951223b4-40d5-46a4-89a9-4af0c7db0e12.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_951223b4-40d5-46a4-89a9-4af0c7db0e12.pdf",
            "file": "_certificate_francistarectican47-gmail-com_951223b4-40d5-46a4-89a9-4af0c7db0e12.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "English for IT 2",
            "date": "14 Apr 2025",
            "dateSort": "20250414",
            "dateISO": "2025-04-14",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_9c50f387-2c9e-434c-84ac-af827e30bd8d.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_9c50f387-2c9e-434c-84ac-af827e30bd8d.pdf",
            "file": "_certificate_francistarectican47-gmail-com_9c50f387-2c9e-434c-84ac-af827e30bd8d.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Networking Devices and Initial Configuration",
            "date": "15 Apr 2025",
            "dateSort": "20250415",
            "dateISO": "2025-04-15",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_9fdc2309-9a41-4338-b600-f7c2ca2a21e3.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_9fdc2309-9a41-4338-b600-f7c2ca2a21e3.pdf",
            "file": "_certificate_francistarectican47-gmail-com_9fdc2309-9a41-4338-b600-f7c2ca2a21e3.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "CSS Essentials",
            "date": "15 Apr 2025",
            "dateSort": "20250415",
            "dateISO": "2025-04-15",
            "category": "web",
            "badge": "BUILT",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_a88fbb2b-3ac0-4e17-9025-e45f5e8a00fd.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_a88fbb2b-3ac0-4e17-9025-e45f5e8a00fd.pdf",
            "file": "_certificate_francistarectican47-gmail-com_a88fbb2b-3ac0-4e17-9025-e45f5e8a00fd.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Python Essentials 1",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "web",
            "badge": "BUILT",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_af08e88c-34a4-4203-ab3a-d411df159572.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_af08e88c-34a4-4203-ab3a-d411df159572.pdf",
            "file": "_certificate_francistarectican47-gmail-com_af08e88c-34a4-4203-ab3a-d411df159572.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Using Computer and Mobile Devices",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_bb0828ab-5bbd-4835-bf98-2da3846e6d7e.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_bb0828ab-5bbd-4835-bf98-2da3846e6d7e.pdf",
            "file": "_certificate_francistarectican47-gmail-com_bb0828ab-5bbd-4835-bf98-2da3846e6d7e.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Network Support and Security",
            "date": "17 Apr 2025",
            "dateSort": "20250417",
            "dateISO": "2025-04-17",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_d35e0450-91db-4ac5-a044-99c04ef80978.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_d35e0450-91db-4ac5-a044-99c04ef80978.pdf",
            "file": "_certificate_francistarectican47-gmail-com_d35e0450-91db-4ac5-a044-99c04ef80978.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Network Defense",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_dab038c8-49c4-4166-9f2a-318210c689a5.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_dab038c8-49c4-4166-9f2a-318210c689a5.pdf",
            "file": "_certificate_francistarectican47-gmail-com_dab038c8-49c4-4166-9f2a-318210c689a5.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Introduction to Greenhouse Gas Accounting for IT",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "data",
            "badge": "ANALYZED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_e0f0b7f2-e093-479a-85a1-f88f42ae3b9f.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_e0f0b7f2-e093-479a-85a1-f88f42ae3b9f.pdf",
            "file": "_certificate_francistarectican47-gmail-com_e0f0b7f2-e093-479a-85a1-f88f42ae3b9f.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Junior Cybersecurity Analyst Career Path Exam",
            "date": "20 Apr 2025",
            "dateSort": "20250420",
            "dateISO": "2025-04-20",
            "category": "cyber",
            "badge": "SECURED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_e20adcb6-2a36-4853-b558-85078ab73343.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_e20adcb6-2a36-4853-b558-85078ab73343.pdf",
            "file": "_certificate_francistarectican47-gmail-com_e20adcb6-2a36-4853-b558-85078ab73343.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Introduction to Modern AI",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "data",
            "badge": "ANALYZED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_e3f65054-f722-4976-a2e2-a91b9b7ab9a5.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_e3f65054-f722-4976-a2e2-a91b9b7ab9a5.pdf",
            "file": "_certificate_francistarectican47-gmail-com_e3f65054-f722-4976-a2e2-a91b9b7ab9a5.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "Data Analytics Essentials",
            "date": "21 Apr 2025",
            "dateSort": "20250421",
            "dateISO": "2025-04-21",
            "category": "data",
            "badge": "ANALYZED",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_e75f5550-7ba1-44b7-b99b-e787b55ed858.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_e75f5550-7ba1-44b7-b99b-e787b55ed858.pdf",
            "file": "_certificate_francistarectican47-gmail-com_e75f5550-7ba1-44b7-b99b-e787b55ed858.pdf"
      },
      {
            "issuer": "Cisco Networking Academy",
            "title": "IT Customer Support Basics",
            "date": "14 Apr 2025",
            "dateSort": "20250414",
            "dateISO": "2025-04-14",
            "category": "core",
            "badge": "FOUNDATION",
            "thumb": "certs/thumbs/_certificate_francistarectican47-gmail-com_e929e243-331e-413d-9527-3f5c80a989aa.png",
            "pdfRel": "certs/_certificate_francistarectican47-gmail-com_e929e243-331e-413d-9527-3f5c80a989aa.pdf",
            "file": "_certificate_francistarectican47-gmail-com_e929e243-331e-413d-9527-3f5c80a989aa.pdf"
      }
];

    const FIELD_WORK = [
      { name: 'Mix & Match Kain', type: 'FULL-STACK — Node.js / Express / WebSockets QR Ordering', url: '#' },
      { name: 'JARVIS AI Council', type: 'FULL-STACK — Multi-Agent Anthropic API Interface', url: '#' },
      { name: '19+ Deployed Client Sites', type: 'VIEW FULL PORTFOLIO', url: 'index.html' },
    ];

    const EFFECTS = [
      { tag: 'RIG-01', label: 'Lenovo LOQ 15IRX10', detail: 'RTX 5070 · Primary Build Machine' },
      { tag: 'RIG-02', label: 'ASUS TUF A15', detail: 'Secondary Machine' },
      { tag: 'COMMS', label: 'Tecno Camon 40 Pro 5G', detail: 'Field Device' },
      { tag: 'DOWNTIME', label: 'Wuthering Waves', detail: 'Active Since v1.0' },
      { tag: 'DOWNTIME', label: 'Arknights: Endfield', detail: 'Current Rotation' },
      { tag: 'DOWNTIME', label: 'Stellar Blade', detail: 'Current Rotation' },
      { tag: 'DOWNTIME', label: 'Neverness to Everness', detail: 'Current Rotation' },
      { tag: 'SIGNAL', label: '@franshess2', detail: 'TikTok — Field Broadcast' },
    ];

    const ARCHIVE = [
      { year: '2026', title: 'Live client work across Palawan', detail: 'Production systems, ordering flows, and deployed interfaces that already exist in the wild.' },
      { year: '2026', title: 'BIR RDO 036', detail: 'Current professional track with a systems-focused day job and practical delivery constraints.' },
      { year: '2026', title: 'BSIT — PTCI', detail: 'Academic track aligned with the build pipeline, not separated from it.' },
    ];

    function renderStack() {
      document.getElementById('stack-grid').innerHTML = STACK.map(s => `
        <div class="stack-card spotlight js-up">
          <div class="stack-cat">${s.cat}</div>
          <div class="stack-name">${s.name}</div>
          <div class="stack-pips">
            ${[1,2,3,4,5].map(i => `<div class="pip${i <= s.level ? ' on' : ''}"></div>`).join('')}
          </div>
        </div>
      `).join('');
    }

    function renderArchive() {
      document.getElementById('archive-grid').innerHTML = ARCHIVE.map(item => `
        <div class="archive-card js-up spotlight">
          <div class="archive-year">${item.year}</div>
          <div class="archive-title">${item.title}</div>
          <div class="archive-detail">${item.detail}</div>
        </div>
      `).join('');
    }


   function renderCreds() {
  const total = CREDENTIALS.length;
  const activeCategories = CATEGORY_ORDER.filter(key => CREDENTIALS.some(c => c.category === key));

  const tally = document.getElementById('cred-tally');
  const bar = document.getElementById('cred-bar');
  const chips = document.getElementById('cred-chips');
  const exhibits = document.getElementById('cred-exhibits');
  const search = document.getElementById('cred-search');
  const sort = document.getElementById('cred-sort');

  if (!tally || !bar || !chips || !exhibits) return;

  const hasSearch = !!search;
  const hasSort = !!sort;

  tally.textContent = `TOTAL RECORDS: ${String(total).padStart(3,'0')} / STATUS: ALL VERIFIED`;

  bar.innerHTML = activeCategories.map(key => {
    const count = CREDENTIALS.filter(c => c.category === key).length;
    const pct = (count / total * 100).toFixed(2);
    return `<div class="cred-bar-seg" data-cat="${key}" style="width:${pct}%; background:${CATEGORIES[key].color};"></div>`;
  }).join('');

  chips.innerHTML = ['all', ...activeCategories].map(key => {
    const isAll = key === 'all';
    const count = isAll ? total : CREDENTIALS.filter(c => c.category === key).length;
    const label = isAll ? 'ALL RECORDS' : CATEGORIES[key].label.toUpperCase();
    const color = isAll ? 'var(--text-sec)' : CATEGORIES[key].color;
    return `
      <button class="cred-chip${isAll ? ' is-active' : ''}" data-filter="${key}" type="button" data-cursor="FILTER">
        <span class="chip-dot" style="background:${color};"></span>
        ${label} <span class="chip-count">(${String(count).padStart(2,'0')})</span>
      </button>
    `;
  }).join('');

  const modal = document.getElementById('cred-modal');
  const modalImg = document.getElementById('cred-modal-img');
  const modalCategory = document.getElementById('cred-modal-category');
  const modalTitle = document.getElementById('cred-modal-title');
  const modalMeta = document.getElementById('cred-modal-meta');
  const modalOpen = document.getElementById('cred-modal-open');

  let selectedFilter = 'all';
  const records = CREDENTIALS.map((c, index) => ({ ...c, fileIndex: index }));

  const sortRecords = (items) => {
    if (!hasSort) return items.slice().sort((a, b) => Number(b.dateSort) - Number(a.dateSort));

    const value = sort.value;
    const byTitle = (a, b) => a.title.localeCompare(b.title);
    const byDateDesc = (a, b) => Number(b.dateSort) - Number(a.dateSort);
    const byDateAsc = (a, b) => Number(a.dateSort) - Number(b.dateSort);

    if (value === 'date-asc') return items.slice().sort(byDateAsc);
    if (value === 'title-asc') return items.slice().sort(byTitle);
    return items.slice().sort(byDateDesc);
  };

  const openModal = (item) => {
    if (!modal || !modalImg || !modalCategory || !modalTitle || !modalMeta || !modalOpen) return;

    const meta = CATEGORIES[item.category];
    modal.dataset.open = 'true';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.style.setProperty('--card-accent', meta.color);

    modalImg.src = item.thumb;
    modalImg.alt = `${item.title} certificate preview`;
    modalCategory.textContent = `${meta.label} · ${item.badge}`;
    modalTitle.textContent = item.title;
    modalMeta.innerHTML = `
      <div><strong>Issuer:</strong> ${item.issuer}</div>
      <div><strong>Date:</strong> ${item.date}</div>
      <div><strong>Category:</strong> ${meta.label}</div>
      <div><strong>File:</strong> FAT-${item.fileNo}</div>
    `;
    modalOpen.href = item.pdfRel;
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  };

  const render = () => {
    const query = hasSearch ? search.value.trim().toLowerCase() : '';

    let filtered = records.filter(item => {
      const pool = [
        item.title,
        item.issuer,
        item.date,
        item.category,
        CATEGORIES[item.category].label
      ].join(' ').toLowerCase();

      const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
      const matchesQuery = !query || pool.includes(query);
      return matchesFilter && matchesQuery;
    });

    filtered = sortRecords(filtered);

    const grouped = CATEGORY_ORDER
      .map(key => ({ key, items: filtered.filter(item => item.category === key) }))
      .filter(group => group.items.length);

    const totalVisible = filtered.length;
    tally.textContent = `TOTAL RECORDS: ${String(total).padStart(3,'0')} / VISIBLE: ${String(totalVisible).padStart(3,'0')} / STATUS: ALL VERIFIED`;

    bar.querySelectorAll('.cred-bar-seg').forEach(seg => {
      const cat = seg.dataset.cat;
      const visibleCount = filtered.filter(c => c.category === cat).length;
      const totalCount = CREDENTIALS.filter(c => c.category === cat).length;
      seg.style.opacity = visibleCount ? '1' : '0.14';
      seg.style.width = `${(totalCount / total * 100).toFixed(2)}%`;
    });

    const groupLetters = { cyber: 'A', web: 'B', data: 'C', core: 'D' };

    if (!grouped.length) {
      exhibits.innerHTML = `<div class="cred-empty js-up spotlight">No matching records.</div>`;
      return;
    }

    exhibits.innerHTML = grouped.map(group => {
      const meta = CATEGORIES[group.key];
      const cards = group.items.map(item => {
        const fileNo = String(item.fileIndex + 1).padStart(4, '0');
        return `
          <a class="cred-card spotlight js-up"
             href="${item.pdfRel}"
             style="--card-accent:${meta.color}; --card-glow:${meta.glow}; --spot-color:${meta.glow};"
             data-pdf="${item.pdfRel}"
             data-thumb="${item.thumb}"
             data-title="${item.title}"
             data-issuer="${item.issuer}"
             data-date="${item.date}"
             data-category="${meta.label}"
             data-file-no="${fileNo}"
             data-badge="${item.badge}"
             data-cursor="PREVIEW">
            <div class="cred-card-top">
              <div class="cred-fileno">FILE NO: FAT-${fileNo}</div>
              <div class="cred-seal">${meta.code}</div>
            </div>

            <div class="cred-thumb">
              <img src="${item.thumb}" alt="${item.title} thumbnail" loading="lazy" />
            </div>

            <div class="cred-title-wrap">
              <div class="cred-issuer">${item.issuer}</div>
              <div class="cred-title">${item.title}</div>
              <div class="cred-mini">${meta.label}</div>
              <div class="cred-card-link">Preview →</div>
            </div>

            <div class="cred-foot">
              <div class="cred-date">${item.date}</div>
              <div class="cred-badge linked">${item.badge}</div>
            </div>
          </a>
        `;
      }).join('');

      return `
        <div class="exhibit-group" data-div="${group.key}">
          <div class="exhibit-head js-left">
            <span class="exhibit-tag" style="color:${meta.color};">EXHIBIT ${groupLetters[group.key] || group.key}</span>
            <span class="exhibit-label">${meta.label}</span>
            <span class="exhibit-count">${String(group.items.length).padStart(2,'0')} ON FILE</span>
            <span class="exhibit-rule"></span>
          </div>
          <div class="cred-grid">${cards}</div>
        </div>
      `;
    }).join('');

    exhibits.querySelectorAll('.cred-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openModal({
          pdfRel: card.dataset.pdf,
          thumb: card.dataset.thumb,
          title: card.dataset.title,
          issuer: card.dataset.issuer,
          date: card.dataset.date,
          category: card.dataset.category,
          fileNo: card.dataset.fileNo,
          badge: card.dataset.badge
        });
      });
    });
  };

  chips.querySelectorAll('.cred-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedFilter = chip.dataset.filter;
      chips.querySelectorAll('.cred-chip').forEach(c => c.classList.toggle('is-active', c === chip));
      render();
    });
  });

  if (hasSearch) search.addEventListener('input', render);
  if (hasSort) sort.addEventListener('change', render);

  if (modal) {
    modal.querySelectorAll('[data-modal-close]').forEach(el => el.addEventListener('click', closeModal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  render();
}
