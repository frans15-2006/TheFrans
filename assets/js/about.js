import Fuse from '/assets/vendor/fuse.min.mjs';

(() => {
'use strict';

    const STACK = [
      { cat: 'CORE', name: 'HTML / CSS', level: 5 },
      { cat: 'CORE', name: 'Vanilla JS', level: 5 },
      { cat: 'GRAPHICS', name: 'WebGL2 / GLSL', level: 4 },
      { cat: 'ANIMATION', name: 'GSAP', level: 5 },
      { cat: 'ANIMATION', name: 'Lenis', level: 4 },
      { cat: 'BACKEND', name: 'Node.js / Express', level: 4 },
      { cat: 'BACKEND', name: 'WebSockets', level: 3 },
      { cat: 'INFRA', name: 'Vercel', level: 5 },
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
  {
    "type": "Live",
    "url": "/mix-match-kain-case-study.html",
    "name": "Mix & Match Kain",
    "description": "A food ordering system for a real restaurant in Palawan. Customers order from their own phones via QR code. The Node.js/Express backend runs on a local machine over LAN &mdash; serving customer devices through restaurant WiFi with no internet dependency. Built to keep working through connectivity loss."
  },
  {
    "type": "Completed",
    "url": "#",
    "name": "VOLT",
    "description": "A smart home energy operations platform for Android. Monitor, control, and automate every electrical outlet in a home from one interface &mdash; room-based dashboards, real-time wattage tracking, fire/overheat detection with emergency shutdown, and an interactive floor plan built for smooth 120&ndash;144&nbsp;Hz motion. Six screens (Dashboard, Automation, Insights, Outlet Detail, Copilot, Settings) run on an MVVM architecture with a Room-backed local database as the single source of truth."
  },
  {
    "type": "Completed",
    "url": "#",
    "name": "FluentFlyout",
    "description": "Contributed to unchihugo/FluentFlyout, an open-source Fluent 2 Design flyout utility for Windows 11. Refactored duplicated taskbar and marquee update logic scattered across property change handlers into two shared helper methods, and hardened the saved-language restore path so a missing or invalid language tag falls back gracefully instead of crashing the app on launch."
  },
  {
    "type": "Web · Android · Windows",
    "url": "https://red-tide-ppc.vercel.app/",
    "name": "RTP — Red Tide PPC",
    "description": "A community observation and reporting platform for Puerto Princesa, Palawan. Explore coastal zones, submit observations with photos, and follow reviewed community warnings and report history. Available on the web with Android and Windows companion apps. Community observations are distinct from official laboratory-confirmed advisories."
  },
  {
    "type": "Built",
    "url": "#",
    "name": "MedFinder PH",
    "description": "A medicine search and pharmacy reservation system for Puerto Princesa. Includes typo-tolerant medicine search, pharmacy stock listings, reservation tracking, and an admin dashboard for stock management and payment-proof review. Built with vanilla HTML, CSS, and JavaScript, backed by Supabase authentication, PostgreSQL, and storage."
  }
];

    const EFFECTS = [
      { tag: 'RIG-01', label: 'Lenovo LOQ 17IRX10', detail: 'Main Build Machine' },
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
      const evidence = {
        'HTML / CSS': ['#s-fieldwork', 'Selected work'],
        'Vanilla JS': ['#s-fieldwork', 'Selected work'],
        'WebGL2 / GLSL': ['/', 'Live interface'],
        'GSAP': ['/', 'Live interface'],
        'Lenis': ['/', 'Live interface'],
        'Node.js / Express': ['/mix-match-kain-case-study.html', 'Ordering system case study'],
        'WebSockets': ['/mix-match-kain-case-study.html', 'Ordering system case study'],
        'Vercel': ['/', 'Live portfolio'],
        'Git': ['https://github.com/frans15-2006/TheFrans', 'Source repository'],
      };
      document.getElementById('stack-grid').innerHTML = STACK.map(s => `
        <article class="stack-card spotlight js-up">
          <div class="stack-cat">${s.cat}</div>
          <div class="stack-name">${s.name}</div>
          ${evidence[s.name] ? `<a class="stack-evidence" href="${evidence[s.name][0]}">${evidence[s.name][1]} <svg class="ui-icon" aria-hidden="true"><use href="/assets/icons.svg#arrow-up-right"></use></svg></a>` : '<div class="stack-evidence">Part of the working stack</div>'}
        </article>
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
      const byId = id => document.getElementById(id);
      const tally = byId('cred-tally');
      const bar = byId('cred-bar');
      const chips = byId('cred-chips');
      const exhibits = byId('cred-exhibits');
      const search = byId('cred-search');
      const sort = byId('cred-sort');
      const results = byId('cred-results');
      const clear = byId('cred-search-clear');
      const reset = byId('cred-reset');
      const params = new URLSearchParams(window.location.search);
      let selectedFilter = activeCategories.includes(params.get('category')) ? params.get('category') : 'all';
      search.value = (params.get('q') || '').slice(0, 200);
      if (['date-desc', 'date-asc', 'title-asc'].includes(params.get('sort'))) sort.value = params.get('sort');

      const icon = name => `<svg class="ui-icon" aria-hidden="true"><use href="/assets/icons.svg#${name}"></use></svg>`;
      const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
      const records = CREDENTIALS.map((c, fileIndex) => ({ ...c, fileIndex, categoryLabel: CATEGORIES[c.category].label }));
      const index = new Fuse(records, {
        keys: [{ name: 'title', weight: 0.55 }, { name: 'issuer', weight: 0.25 }, { name: 'categoryLabel', weight: 0.15 }, { name: 'date', weight: 0.05 }],
        threshold: 0.32, ignoreLocation: true, minMatchCharLength: 2,
      });
      let visibleRecords = [];
      let currentIndex = -1;
      let searchTimer;

      bar.innerHTML = activeCategories.map(key => {
        const count = records.filter(c => c.category === key).length;
        return `<div class="cred-bar-seg" aria-hidden="true" data-cat="${key}" style="width:${count / total * 100}%;background:${CATEGORIES[key].color}"></div>`;
      }).join('');
      chips.setAttribute('role', 'group');
      chips.setAttribute('aria-label', 'Filter certificates by category');
      chips.innerHTML = ['all', ...activeCategories].map(key => {
        const count = key === 'all' ? total : records.filter(c => c.category === key).length;
        const label = key === 'all' ? 'ALL RECORDS' : CATEGORIES[key].label.toUpperCase();
        const color = key === 'all' ? 'var(--text-sec)' : CATEGORIES[key].color;
        return `<button class="cred-chip" data-filter="${key}" type="button" aria-pressed="false" aria-controls="cred-exhibits" data-cursor="FILTER"><span class="chip-dot" aria-hidden="true" style="background:${color}"></span>${label} <span class="chip-count">(${String(count).padStart(2, '0')})</span></button>`;
      }).join('');

      const modal = byId('cred-modal');
      const dialog = new window.A11yDialog(modal);
      const image = byId('cred-modal-img');
      const previewError = byId('cred-preview-error');
      const previous = byId('cred-previous');
      const next = byId('cred-next');
      const background = Array.from(document.body.children).filter(element => element !== modal && !['SCRIPT', 'STYLE'].includes(element.tagName));
      const inertBefore = new Map();
      dialog.on('show', () => {
        document.documentElement.classList.add('dialog-open');
        modal.classList.add('is-open');
        background.forEach(element => { inertBefore.set(element, element.inert); element.inert = true; });
        lenis.stop();
      });
      dialog.on('hide', () => {
        modal.classList.remove('is-open');
        document.documentElement.classList.remove('dialog-open');
        background.forEach(element => { element.inert = inertBefore.get(element) || false; });
        inertBefore.clear();
        lenis.start();
      });
      image.addEventListener('load', () => image.classList.remove('is-loading'));
      image.addEventListener('error', () => { image.hidden = true; previewError.hidden = false; });

      function showRecord(position, event) {
        const item = visibleRecords[position];
        if (!item) return;
        currentIndex = position;
        const meta = CATEGORIES[item.category];
        modal.style.setProperty('--card-accent', meta.color);
        image.hidden = false;
        previewError.hidden = true;
        image.classList.add('is-loading');
        image.alt = `${item.title} certificate issued by ${item.issuer}`;
        image.src = item.thumb;
        byId('cred-modal-category').textContent = `${meta.label} · ${item.badge}`;
        byId('cred-modal-title').textContent = item.title;
        byId('cred-modal-meta').innerHTML = `<div><strong>Issuer:</strong> ${escape(item.issuer)}</div><div><strong>Date:</strong> <time datetime="${item.dateISO}">${escape(item.date)}</time></div><div><strong>Category:</strong> ${escape(meta.label)}</div><div><strong>Record:</strong> FAT-${String(item.fileIndex + 1).padStart(4, '0')}</div>`;
        byId('cred-modal-open').href = item.pdfRel;
        byId('cred-modal-position').textContent = `${position + 1} / ${visibleRecords.length}`;
        previous.disabled = position === 0;
        next.disabled = position === visibleRecords.length - 1;
        modal.querySelector('.cred-modal-shell').scrollTop = 0;
        dialog.show(event);
      }
      previous.addEventListener('click', event => showRecord(currentIndex - 1, event));
      next.addEventListener('click', event => showRecord(currentIndex + 1, event));
      modal.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', event => dialog.hide(event)));
      modal.addEventListener('keydown', event => {
        if (event.target.matches('input,select,textarea')) return;
        if (event.key === 'ArrowLeft') { event.preventDefault(); showRecord(currentIndex - 1, event); }
        if (event.key === 'ArrowRight') { event.preventDefault(); showRecord(currentIndex + 1, event); }
      });
      window.addEventListener('pagehide', () => { if (dialog.shown) dialog.hide(); });

      function persistFilters() {
        const url = new URL(window.location.href);
        const query = search.value.trim();
        query ? url.searchParams.set('q', query) : url.searchParams.delete('q');
        selectedFilter === 'all' ? url.searchParams.delete('category') : url.searchParams.set('category', selectedFilter);
        sort.value === 'date-desc' ? url.searchParams.delete('sort') : url.searchParams.set('sort', sort.value);
        window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
      }

      function render() {
        const query = normalize(search.value.trim());
        const yearQuery = /^\d{4}$/.test(query);
        const matched = query && !yearQuery ? new Set(index.search(query).map(result => result.item.fileIndex)) : null;
        visibleRecords = records.filter(item => {
          const exact = yearQuery ? item.dateISO.slice(0, 4) === query : normalize([item.title, item.issuer, item.date, item.category, item.categoryLabel].join(' ')).includes(query);
          return (selectedFilter === 'all' || item.category === selectedFilter) && (!query || exact || matched?.has(item.fileIndex));
        });
        visibleRecords.sort(sort.value === 'title-asc' ? (a, b) => a.title.localeCompare(b.title) : sort.value === 'date-asc' ? (a, b) => Number(a.dateSort) - Number(b.dateSort) : (a, b) => Number(b.dateSort) - Number(a.dateSort));
        // Preview navigation follows the same category groups and card order as the gallery.
        visibleRecords = CATEGORY_ORDER.flatMap(key => visibleRecords.filter(item => item.category === key));
        const count = visibleRecords.length;
        tally.textContent = `${String(total).padStart(3, '0')} RECORDS ON FILE / ${String(count).padStart(3, '0')} SHOWN`;
        const scope = selectedFilter === 'all' ? 'all categories' : CATEGORIES[selectedFilter].label;
        results.textContent = `${count} of ${total} certificates · ${scope}${search.value.trim() ? ` · “${search.value.trim()}”` : ''}`;
        clear.hidden = !search.value;
        chips.querySelectorAll('.cred-chip').forEach(chip => {
          const active = chip.dataset.filter === selectedFilter;
          chip.classList.toggle('is-active', active);
          chip.setAttribute('aria-pressed', String(active));
        });
        bar.querySelectorAll('.cred-bar-seg').forEach(segment => {
          segment.style.opacity = visibleRecords.some(record => record.category === segment.dataset.cat) ? '1' : '0.14';
        });
        const letters = { cyber: 'A', web: 'B', data: 'C', core: 'D' };
        exhibits.innerHTML = CATEGORY_ORDER.map(key => {
          const items = visibleRecords.filter(item => item.category === key);
          if (!items.length) return '';
          const meta = CATEGORIES[key];
          const cards = items.map(item => `<a class="cred-card spotlight" href="${item.pdfRel}" style="--card-accent:${meta.color};--card-glow:${meta.glow};--spot-color:${meta.glow}" data-idx="${item.fileIndex}" data-cursor="PREVIEW" aria-haspopup="dialog" aria-controls="cred-modal"><div class="cred-card-top"><div class="cred-fileno">FILE NO: FAT-${String(item.fileIndex + 1).padStart(4, '0')}</div><div class="cred-seal">${meta.code}</div></div><div class="cred-thumb"><img src="${item.thumb}" alt="" loading="lazy" decoding="async" /></div><div class="cred-title-wrap"><div class="cred-issuer">${escape(item.issuer)}</div><div class="cred-title">${escape(item.title)}</div><div class="cred-mini">${meta.label}</div><div class="cred-card-link">Preview certificate ${icon('arrow-up-right')}</div></div><div class="cred-foot"><time class="cred-date" datetime="${item.dateISO}">${escape(item.date)}</time><div class="cred-badge linked">${escape(item.badge)}</div></div></a>`).join('');
          return `<section class="exhibit-group" data-div="${key}" aria-labelledby="exhibit-${key}"><div class="exhibit-head"><span class="exhibit-tag" style="color:${meta.color}">EXHIBIT ${letters[key]}</span><h3 class="exhibit-label" id="exhibit-${key}">${meta.label}</h3><span class="exhibit-count">${String(items.length).padStart(2, '0')} ON FILE</span><span class="exhibit-rule" aria-hidden="true"></span></div><div class="cred-grid">${cards}</div></section>`;
        }).join('') || '<div class="cred-empty">No certificates match these filters. Clear the search or use Reset filters to show every record.</div>';
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        persistFilters();
      }
      exhibits.addEventListener('click', event => {
        const card = event.target.closest('.cred-card');
        if (!card || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        const position = visibleRecords.findIndex(item => item.fileIndex === Number(card.dataset.idx));
        if (position < 0) return;
        event.preventDefault();
        card.focus({ preventScroll: true });
        showRecord(position, event);
      });
      chips.addEventListener('click', event => {
        const chip = event.target.closest('.cred-chip');
        if (!chip) return;
        clearTimeout(searchTimer);
        selectedFilter = chip.dataset.filter;
        render();
      });
      search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(render, 120); });
      sort.addEventListener('change', () => { clearTimeout(searchTimer); render(); });
      clear.addEventListener('click', () => { clearTimeout(searchTimer); search.value = ''; render(); search.focus(); });
      reset.addEventListener('click', () => {
        clearTimeout(searchTimer); search.value = ''; selectedFilter = 'all'; sort.value = 'date-desc'; render(); search.focus();
      });
      render();
    }


    function renderFieldwork() {
      document.getElementById('fw-list').innerHTML = FIELD_WORK.map((f, i) => `
        <article class="fw-project">
          <div class="fw-project-top"><span class="fw-idx">${String(i + 1).padStart(2,'0')}</span><span class="fw-project-status">${f.type}</span></div>
          <h3 class="fw-project-name">${f.name}</h3>
          <p class="fw-project-description">${f.description}</p>
          ${f.url === '#' ? '' : `<a class="fw-project-link" href="${f.url}">View project &rarr;</a>`}
        </article>
      `).join('');
    }
    function renderEffects() {
      document.getElementById('effects-grid').innerHTML = EFFECTS.map((e, i) => `
        <div class="effect-tag js-up spotlight">
          <div class="effect-num">${e.tag}-${String(i + 1).padStart(2,'0')}</div>
          <div class="effect-label">${e.label}</div>
          <div class="effect-detail">${e.detail}</div>
        </div>
      `).join('');
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    const motionReady = !!(window.gsap && window.ScrollTrigger);
    const lightMotion = !finePointer || window.matchMedia('(max-width:768px)').matches || reduceMotion || !!navigator.connection?.saveData || !motionReady;
    document.documentElement.classList.toggle('light-motion', lightMotion);
    if (motionReady) gsap.registerPlugin(ScrollTrigger);

    renderStack();
    renderArchive();
    renderCreds();
    renderFieldwork();
    renderEffects();

    const lenis = Portfolio.createScroller({ lightMotion, options: { lerp: 0.08, duration: 1.35 } });

    window.addEventListener('scroll', () => {
      document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    if (motionReady && !lightMotion) {
    document.querySelectorAll('.ch-title').forEach(title => {
      const line = document.createElement('span');
      line.className = 'chapter-underline';
      line.setAttribute('aria-hidden', 'true');
      title.appendChild(line);
      gsap.from(line, { scaleX: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: title, start: 'top 88%', once: true } });
    });
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl
      .from('#hero-case', { opacity: 0, duration: 0.8, delay: 0.15 })
      .from('#h-first', { y: '110%', opacity: 0, duration: 1.1 }, '-=0.4')
      .from('#h-last', { y: '110%', opacity: 0, duration: 1.1 }, '-=0.85')
      .from('#hero .hero-lead', { y: 18, opacity: 0, duration: 0.75 }, '-=0.55')
      .from('#hero-meta .meta-field', { y: 18, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }, '-=0.45')
      .from('.hero-side > *', { y: 24, opacity: 0, stagger: 0.08, duration: 0.75 }, '-=0.65')
      .to('#seal', {
        opacity: 0.55,
        scale: 1,
        rotate: -16,
        duration: 0.7,
        ease: 'back.out(1.5)',
        onComplete: () => {
          if (!reduceMotion) {
            gsap.to('#seal', { rotate: '-=4', duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          }
        }
      }, '-=0.3');

    gsap.to('#scan-line', {
      top: '100%',
      opacity: 0.5,
      duration: 1.4,
      ease: 'power1.inOut',
      delay: 0.2,
      onComplete: () => { document.getElementById('scan-line').style.opacity = 0; }
    });

    const makeScrollAnim = (selector, fromVars, overrides = {}) => {
      gsap.utils.toArray(selector).forEach(el => {
        gsap.from(el, {
          ...fromVars,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
            ...overrides,
          }
        });
      });
    };

    setTimeout(() => {
      makeScrollAnim('.js-up', { y: 36, opacity: 0 });
      makeScrollAnim('.js-left', { x: -52, opacity: 0 });
      if (!reduceMotion) {
        gsap.to('#mission-text .redact-bar', {
          scaleX: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: '#mission-text',
            start: 'top 78%',
            toggleActions: 'play none none none',
          }
        });
      }
    }, 50);

    }

    if (!lightMotion) document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.spotlight');
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });

    const tabs = Array.from(document.querySelectorAll('.dossier-tab'));
    const tabStrip = document.getElementById('dossier-tabs');
    const aboutHeader = document.getElementById('about-header');
    const compactNavigation = window.matchMedia('(max-width:1099px)');
    function navigationOffset() {
      const header = compactNavigation.matches ? aboutHeader : document.getElementById('nav');
      return Math.ceil(header.getBoundingClientRect().height) + 16;
    }
    function updateHeaderSpacing() {
      document.documentElement.style.setProperty('--about-scroll-offset', navigationOffset() + 'px');
    }
    new ResizeObserver(updateHeaderSpacing).observe(aboutHeader);
    window.addEventListener('resize', updateHeaderSpacing, { passive: true });
    updateHeaderSpacing();
    const sectionIds = ['hero', 's-identity', 's-profile', 's-arsenal', 's-archive', 's-credentials', 's-fieldwork', 's-fieldkit'];
    const tabByTarget = new Map(tabs.map(tab => [tab.dataset.target, tab]));
    let activeSectionId = null;
    let scrollTicking = false;

    function setActiveTab(targetId) {
      if (activeSectionId === targetId) return;
      activeSectionId = targetId;
      tabs.forEach(tab => { const active = tab.dataset.target === targetId; tab.classList.toggle('is-active', active); tab.setAttribute('aria-current', active ? 'location' : 'false'); });
      if (compactNavigation.matches) {
        const activeTab = tabByTarget.get(targetId);
        if (activeTab) tabStrip.scrollTo({ left: activeTab.offsetLeft - (tabStrip.clientWidth - activeTab.offsetWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }

    function resolveActiveSection() {
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) return sectionIds[sectionIds.length - 1];
      const line = window.innerHeight * 0.42;
      let fallback = sectionIds[0];
      let current = null;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= line) fallback = id;
        if (rect.top <= line && rect.bottom > line) {
          current = id;
          break;
        }
      }

      return current || fallback;
    }

    function updateActiveTab() {
      setActiveTab(resolveActiveSection());
      scrollTicking = false;
    }

    function requestTabUpdate() {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(updateActiveTab);
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = document.getElementById(tab.dataset.target);
        if (!target) return;
        if (lenis && typeof lenis.scrollTo === 'function') {
          const top = target.getBoundingClientRect().top + window.scrollY;
          lenis.scrollTo(top, { offset: -navigationOffset() });
        } else {
          target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        }
      });
    });

    ['scroll', 'resize'].forEach(evt => window.addEventListener(evt, requestTabUpdate, { passive: true }));
    new ResizeObserver(requestTabUpdate).observe(document.body);
    if (lenis && typeof lenis.on === 'function') lenis.on('scroll', requestTabUpdate);
    requestTabUpdate();

    if (finePointer && !lightMotion) {
      document.body.classList.add('has-cursor');
      const dot = document.getElementById('cursor-dot');
      const ring = document.getElementById('cursor-ring');
      const label = document.getElementById('cursor-label');

      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my;

      window.addEventListener('mousemove', (e) => {
        mx = e.clientX; my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

        const target = e.target.closest('[data-cursor]');
        if (target) {
          ring.classList.add('is-active');
          label.textContent = target.dataset.cursor;
        } else {
          ring.classList.remove('is-active');
          label.textContent = '';
        }
      });

      const raf = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      document.addEventListener('mousemove', (e) => {
        const magnet = e.target.closest('.nav-return');
        if (!magnet) return;
        const rect = magnet.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width / 2);
        const relY = e.clientY - (rect.top + rect.height / 2);
        gsap.to(magnet, { x: relX * 0.28, y: relY * 0.28, duration: 0.35, ease: 'power2.out' });
      });

      document.querySelectorAll('.nav-return').forEach(el => {
        el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.5)' }));
      });
    } else {
      document.getElementById('cursor-dot').style.display = 'none';
      document.getElementById('cursor-ring').style.display = 'none';
    }

})();
