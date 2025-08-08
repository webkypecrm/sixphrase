import React, { Fragment, useEffect, useState } from "react";
import { use } from "react";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";

const GenerateNDA = () => {
  const [staffData, setStaffData] = useState({});

  const {id} = useParams();
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem("token") || "";

  const getStaffData = async () => {
    try {
      const res = await axios.get(`${apiUrl}/staff/staff-details/${id}`, {
        headers: { Authorization: `Bearer ${Token}` },
      });
      setStaffData(res.data.data);
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    getStaffData();
  },[])
  console.log("staffData =>", staffData)
  return (
    <Fragment>
      <div className="main-nda-container">
        <div className="nda-container">
          <h1 className="text-center fs-2 fw-bold mb-4" style={{color: "#1d4ed8"}}>
            EMPLOYER-EMPLOYEE NON-DISCLOSURE AGREEMENT (NDA)
          </h1>
          <p className="mb-3">
            This Non-Disclosure Agreement ("Agreement") is made effective as of{" "}
            <strong className="text-primary">{dayjs(staffData?.createdAt).format("DD-MM-YYYY")}</strong> (the
            "Effective Date")
          </p>
          <h2 className="fs-5 fw-semibold mb-3">BETWEEN:</h2>
          <p className="mb-3">
            <strong className="text-primary">{staffData?.userCompany?.companyName}</strong> (hereinafter referred
            to as the "Company"),a company duly incorporated and existing under
            the laws of India, having its registered office at <span className="text-primary">{staffData?.userCompany?.address}</span>.
          </p>
          <p className="mb-3">
            <strong>AND</strong>
          </p>
          <p className="mb-3">
            <strong className="text-primary">{staffData?.name}</strong> (hereinafter referred to as the
            "Employee"), an individual residing at{" "}
            <span >
              {staffData?.address}
            </span>
            , and duly employed by the Company in the position of <strong className="text-primary">{staffData?.role?.name}</strong>.
          </p>
          <p className="mb-4">
            (Hereinafter collectively referred to as the "Parties" and
            individually as a "Party")
          </p>
          <div className="section-divider" />
          <h2 className="fs-5 fw-semibold mb-3">RECITALS:</h2>
          <p className="mb-2">
            WHEREAS, the Company is engaged in the highly competitive business
            of Artificial Intelligence development, research, and related
            services, which involves the creation, development, and utilization
            of valuable proprietary and confidential information, trade secrets,
            and intellectual property;
          </p>
          <p className="mb-2">
            WHEREAS, the Employee is being employed by the Company in a position
            that necessitates access to, exposure to, and/or the creation of,
            highly sensitive and proprietary Confidential Information (as
            hereinafter defined) belonging to the Company, its affiliates,
            clients, and business partners;
          </p>
          <p className="mb-2">
            WHEREAS, the Company's willingness to employ the Employee and
            provide access to such Confidential Information is expressly
            conditioned upon the Employee's strict adherence to the terms and
            conditions set forth in this Agreement;
          </p>
          <p className="mb-5">
            NOW, THEREFORE, in consideration of the foregoing recitals, the
            mutual covenants and promises contained herein, the Employee's
            employment by the Company, and for other good and valuable
            consideration, the receipt and sufficiency of which are hereby
            acknowledged, the Parties, intending to be legally bound, hereby
            agree as follows:
          </p>
          <h2 className="fs-5 fw-semibold mb-3">
            1. DEFINITION OF CONFIDENTIAL INFORMATION:
          </h2>
          <p className="mb-3">
            "Confidential Information" shall be broadly construed to mean any
            and all non-public information, data, materials, documents, or
            knowledge, whether tangible or intangible, oral, written,
            electronic, visual, or in any other form, disclosed by the Company
            to the Employee, or accessed, created, or developed by the Employee
            in the course of or as a result of their employment with the
            Company. Confidential Information includes, but is not limited to,
            the following categories, regardless of whether specifically marked
            as "Confidential" or "Proprietary":
          </p>
          <ul className="mb-4">
            <li className="mb-2">
              <strong>1.1 Business Information:</strong> Including, but not
              limited to, business plans, strategic plans, marketing plans,
              sales forecasts, financial data, pricing policies, cost
              structures, profit margins, customer lists, prospect lists, vendor
              lists, supplier information, investment strategies, operational
              methods, internal policies, procedures, and any other information
              relating to the Company's current or future business activities.
            </li>
            <li className="mb-2">
              <strong>1.2 Technical Information:</strong> Including, but not
              limited to, source code, object code, algorithms, software
              architecture, designs, specifications, inventions (whether
              patentable or not), discoveries, research and development
              activities, product development plans, technical drawings, data
              models, methodologies, processes, formulas, know-how, prototypes,
              test results, and all other proprietary technical information,
              including trade secrets as defined under applicable law.
            </li>
            <li className="mb-2">
              <strong>1.3 Client/Customer Information:</strong> Including, but
              not limited to, identities of clients and customers, contact
              details, contractual terms, business requirements, project
              specifics, project data, deliverables, communications, and any
              other information provided by or pertaining to the Company's
              clients or customers.
            </li>
            <li className="mb-2">
              <strong>1.4 Personnel Information:</strong> Including, but not
              limited to, employee records, compensation structures, performance
              evaluations, disciplinary actions, and other sensitive human
              resources data.
            </li>
            <li className="mb-2">
              <strong>1.5 Proprietary Information:</strong> Any information that
              derives independent economic value, actual or potential, from not
              being generally known to, and not being readily ascertainable by
              proper means by, other persons who can obtain economic value from
              its disclosure or use. ...
            </li>
            <li className="mb-2">
              <strong>1.6 Information Marked as Confidential:</strong> Any
              information that is explicitly marked or designated as
              "Confidential," "Proprietary," "Restricted," or with a similar
              legend, or that the Employee reasonably understands, or should
              reasonably understand, to be confidential due to the nature of the
              information or the circumstances surrounding its disclosure or
              access.
            </li>
          </ul>
          <p className="mb-4">
            Confidential Information shall <strong>not</strong> include
            information that: (a) is or becomes generally available to the
            public through no act or fault of the Employee; (b) was rightfully
            known to the Employee, as evidenced by written records, prior to its
            disclosure by the Company hereunder and without breach of any
            confidentiality obligation; (c) is rightfully obtained by the
            Employee from a third party who has no obligation of confidentiality
            to the Company regarding such information; or (d) is independently
            developed by the Employee without use of or reference to the
            Company's Confidential Information.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">
            2. OBLIGATIONS OF THE EMPLOYEE:
          </h2>
          <p className="mb-3">
            The Employee hereby covenants and agrees to the following
            obligations regarding Confidential Information and conduct:
          </p>
          <ul className="mb-4">
            <li className="mb-2">
              <strong>2.1 Strict Confidentiality:</strong> The Employee shall,
              at all times during and after the term of employment, hold all
              Confidential Information in the strictest confidence and shall
              not, directly or indirectly, disclose, publish, reproduce,
              transmit, or disseminate any Confidential Information to any third
              party without the express prior written consent of an authorized
              officer of the Company.
            </li>
            <li className="mb-2">
              <strong>2.2 Limited Use:</strong> The Employee shall use the
              Confidential Information solely for the purpose of performing
              duties for the Company's benefit and within the scope of their
              employment, and for no other purpose whatsoever, including, but
              not limited to, personal gain, or for the benefit of any competing
              entity or third party.
            </li>
            <li className="mb-2">
              <strong>2.3 Protection Measures:</strong> The Employee shall take
              all reasonable and necessary precautions to safeguard the
              Confidential Information from unauthorized access, use,
              disclosure, or misappropriation. This includes, without
              limitation, adhering to all Company policies and procedures
              regarding information security, data protection, password
              management, and acceptable use of Company systems and resources.
            </li>
            <li className="mb-2">
              <strong>2.4 No Unauthorized Duplication or Removal:</strong> The
              Employee shall not make any unauthorized copies, reproductions, or
              summaries of Confidential Information, nor shall the Employee
              remove any Confidential Information or Company property from the
              Company's premises without prior written authorization.
            </li>
            <li className="mb-2">
              <strong>2.5 Reporting Unauthorized Disclosure:</strong> The
              Employee shall immediately notify the Company's management, Human
              Resources department, and/or Legal department upon becoming aware
              of any actual, suspected, or threatened unauthorized disclosure,
              use, access to, or misappropriation of Confidential Information.
            </li>
            <li className="mb-2">
              <strong>2.6 Return of Information and Property:</strong> Upon the
              termination of employment for any reason whatsoever, or at any
              time upon the Company's written request, the Employee shall
              immediately return to the Company all Confidential Information
              (including all originals and copies thereof, whether in physical,
              electronic, or any other form), all Company property (including,
              but not limited to, laptops, mobile devices, storage devices,
              keys, access cards, and documents), and any materials related to
              Company projects, clients, or business. The Employee shall not
              retain any copies, electronic or otherwise, of Company
              information, and shall certify in writing, if requested by the
              Company, that all such materials have been returned or destroyed.
            </li>
            <li className="mb-2">
              <strong>2.7 Exclusive Employment and Outside Activities:</strong>{" "}
              The Employee agrees that during the entire term of employment with
              the Company, they shall devote their full time, attention, and
              best efforts exclusively to the business and interests of the
              Company. The Employee shall not, without the express prior written
              consent of an authorized officer of the Company, directly or
              indirectly, engage in any other employment, business, freelancing
              activities, gig work, or any other professional or commercial
              undertaking, whether for remuneration or otherwise, with any other
              company, organization, group, or individual. This includes, but is
              not limited to, any form of consulting, advisory, or independent
              contractor work. Any violation of this clause shall be considered
              a material breach of this Agreement and the Employee's employment
              contract, subject to the consequences outlined in Section 8.
            </li>
          </ul>
          <h2 className="fs-5 fw-semibold mb-3">
            3. OWNERSHIP OF INTELLECTUAL PROPERTY AND WORK PRODUCTS:
          </h2>
          <p className="mb-3">
            The Employee acknowledges and agrees that all inventions,
            discoveries, designs, developments, improvements, works of
            authorship, software, algorithms, data, trade secrets, processes,
            techniques, and other intellectual property (collectively,
            "Inventions") that are conceived, made, reduced to practice, or
            developed by the Employee, either alone or jointly with others,
            during the course of their employment with the Company, whether or
            not during normal working hours, and that relate to the Company's
            actual or anticipated business, research, development, or are made
            using Company resources or Confidential Information, are and shall
            be the sole and exclusive property of the Company
          </p>
          <p className="mb-3">
            Furthermore, the Employee expressly agrees that any work product,
            code, design, email communication, content, sales materials,
            marketing collateral, documentation, testing results, or anything
            related to the Employee's work profile for Caasaa AI Innovations Pvt
            Ltd, which is created, developed, or performed using
            Company-provided laptops, equipment, or other resources, or within
            the Company's office premises, or during official working hours,
            shall be deemed the exclusive property of the Company from all
            perspectives, including intellectual property rights.
          </p>
          <p className="mb-4">
            The Employee agrees to promptly and fully disclose all such
            Inventions and work products to the Company. The Employee further
            agrees to execute all necessary documents and take all reasonable
            actions requested by the Company, both during and after employment,
            to perfect and confirm the Company's sole and exclusive ownership
            rights in such Inventions and work products, including, but not
            limited to, assisting in the preparation, filing, prosecution, and
            maintenance of patent applications, copyright registrations,
            trademark applications, and other intellectual property protections
            worldwide.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">4. TERM AND SURVIVAL:</h2>
          <p className="mb-4">
            This Agreement shall commence on the Effective Date and shall remain
            in full force and effect throughout the entire duration of the
            Employee's employment with the Company. The obligations of
            confidentiality and non-use of Confidential Information as set forth
            in Section 2, the provisions regarding ownership of intellectual
            property as set forth in Section 3, the Non-Compete Clause as set
            forth in Section 6, the provisions regarding Notice Period and
            Handover as set forth in Section 7, and the provisions regarding
            Breach and Consequences as set forth in Section 8, shall survive the
            termination of the Employee's employment with the Company for any
            reason whatsoever (including, but not limited to, resignation,
            termination for cause, termination without cause, retirement, or
            death) and shall continue indefinitely, or for the specific periods
            stipulated herein.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">5. REMEDIES:</h2>
          <p className="mb-4">
            The Employee expressly acknowledges and agrees that any actual or
            threatened unauthorized disclosure, use, or misappropriation of
            Confidential Information, or any breach of the Non-Compete Clause,
            would cause immediate and irreparable harm to the Company, for which
            monetary damages alone would be an inadequate remedy. Therefore, in
            the event of any such breach or threatened breach, the Company shall
            be entitled to seek, in addition to any other remedies available at
            law or in equity, immediate injunctive relief (including temporary
            restraining orders, preliminary injunctions, and permanent
            injunctions) from any court of competent jurisdiction, without the
            necessity of posting a bond or proving actual damages. The Employee
            further agrees to waive any claim or defense that the Company has an
            adequate remedy at law.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">6. NON-COMPETE CLAUSE:</h2>
          <p className="mb-3">
            To protect the legitimate business interests, goodwill, and client
            relationships of Caasaa AI Innovations Pvt Ltd, and in consideration
            of the specialized training, access to Confidential Information, and
            client exposure provided to the Employee, the Employee explicitly
            agrees to the following restrictive covenants:
          </p>
          <ul className="mb-4">
            <li className="mb-2">
              <strong>6.1 Prohibition:</strong> The Employee shall not, for a
              period of{" "}
              <strong className="text-primary">twelve (12) months</strong>{" "}
              commencing from the effective date of resignation or termination
              of employment from the Company (the "Restricted Period"), directly
              or indirectly, in any capacity (including but not limited to as an
              employee, consultant, contractor, owner, partner, director,
              officer, agent, or shareholder holding more than 1% of the
              outstanding shares of a publicly traded company), engage with,
              work for, or accept any offer of employment or engagement from any
              entity that was an existing client of Caasaa AI Innovations Pvt
              Ltd at any point during the Employee's tenure, and for whom the
              Employee directly worked on a project, provided services, or had
              access to their confidential information, business strategies, or
              proprietary data.
            </li>
            <li className="mb-2">
              <strong>6.2 Scope:</strong> This prohibition specifically applies
              to any client with whom the Employee had direct interaction, was
              assigned to their projects, provided services to, or gained
              knowledge of their specific business requirements, technologies,
              or confidential information during their employment with the
              Company. The term "existing client" includes any entity that had
              an active contractual relationship with the Company during the
              Employee's employment.
            </li>
            <li className="mb-2">
              <strong>6.3 Geographic Scope:</strong> This Non-Compete Clause
              shall apply globally, given the nature of the Company's business
              and the potential for remote work and international client
              engagement.
            </li>
            <li className="mb-2">
              <strong>6.4 Acknowledgement of Reasonableness:</strong> The
              Employee acknowledges that the duration, scope, and geographic
              limitations of this Non-Compete Clause are reasonable and
              necessary to protect the Company's legitimate business interests,
              including its Confidential Information, trade secrets, and client
              relationships, and that the Employee will not suffer undue
              hardship by complying with this clause.
            </li>
          </ul>
          <h2 className="fs-5 fw-semibold mb-3">
            7. NOTICE PERIOD, KNOWLEDGE TRANSFER, AND FINAL SETTLEMENT:
          </h2>
          <ul className="mb-4">
            <li className="mb-2">
              <strong>7.1 Notice Period:</strong> In the event of resignation or
              termination of employment, the Employee shall be required to serve
              the notice period as stipulated in their Employment Contract or
              Offer Letter.
            </li>
            <li className="mb-2">
              <strong>7.2 Knowledge Transfer and Handover:</strong> During the
              notice period, the Employee shall diligently and completely hand
              over all knowledge, ongoing tasks, project details, documentation,
              and any other relevant information to the assigned colleague(s) or
              successor(s) as directed by the Reporting Manager and Company
              Management. This includes providing comprehensive training and
              ensuring a smooth transition of responsibilities. The Employee
              must secure a formal sign-off from their Reporting Manager and
              Company Management confirming the satisfactory completion of all
              knowledge transfer and handover responsibilities.
            </li>
            <li className="mb-2">
              <strong>7.3 Final Settlement Hold:</strong> The full and final
              settlement of the Employee's dues, including but not limited to,
              pending salary, leave encashment, and any other benefits, shall be
              contingent upon the successful and complete handover of duties and
              knowledge transfer, and the issuance of a No Objection Certificate
              (NOC) or formal sign-off by the Reporting Manager and Company
              Management. In the absence of such a satisfactory sign-off and
              NOC, the full and final settlement may be held by the Company
              until such conditions are met to the Company's satisfaction.
            </li>
          </ul>
          <h2 className="fs-5 fw-semibold mb-3">8. BREACH AND CONSEQUENCES:</h2>
          <p className="mb-3">
            Any breach of this Agreement by the Employee, including but not
            limited to any unauthorized disclosure, use, or retention of
            Confidential Information, violation of the Non-Compete Clause,
            infringement of the Company's intellectual property rights, breach
            of the Exclusive Employment clause, or any act of defamation, shall
            result in severe consequences and entitle the Company to pursue all
            available legal and equitable remedies:
          </p>
          <ul className="mb-4">
            <li className="mb-2">
              <strong>8.1 Legal Actions:</strong> The Company reserves the
              unequivocal right to initiate and pursue all necessary legal
              actions, including, but not limited to, civil lawsuits for
              damages, specific performance, and injunctive relief, and to
              pursue criminal prosecution where applicable, against the Employee
              for any and all breaches of this Agreement.
            </li>
            <li className="mb-2">
              <strong>8.2 Penalties and Damages:</strong> The Employee shall be
              fully liable to the Company for all direct, indirect,
              consequential, incidental, punitive, and exemplary damages,
              losses, costs, and expenses (including, without limitation,
              reasonable attorneys' fees, expert witness fees, and court costs)
              incurred by the Company as a result of the Employee's breach. This
              may include, but is not limited to, loss of business
              opportunities, competitive disadvantage, loss of profits,
              reputational harm, and the cost of remedial measures.
            </li>
            <li className="mb-2">
              <strong>8.3 Recovery of Payments:</strong> In the event of a
              material breach of this Agreement, the Company shall have the
              absolute right to recover any payments made to the Employee,
              including, but not limited to, performance bonuses, incentives,
              commissions, or other forms of compensation that were contingent
              upon or related to the Employee's adherence to the terms of this
              Agreement. The Company may, at its sole discretion, offset any
              such recoverable amounts against any outstanding payments (e.g.,
              final salary, leave encashment) due to the Employee.
            </li>
            <li className="mb-2">
              <strong>8.4 Defamation and Disparagement:</strong> The Employee
              shall not, at any time during or after employment, engage in any
              conduct, statements, or publications (whether oral, written,
              electronic, or visual, including but not limited to social media
              posts, online reviews, public forums, or media interviews) that
              are defamatory, disparaging, libelous, slanderous, or otherwise
              harmful to the reputation, goodwill, business, products, services,
              employees, or management of the Company or its affiliates. Any
              such act shall be considered a material breach of this Agreement,
              entitling the Company to pursue all available legal remedies,
              including, but not limited to, damages for reputational harm and
              injunctive relief to prevent further disparagement.
            </li>
            <li className="mb-2">
              <strong>8.5 Termination of Employment:</strong> Any material
              breach of this Agreement shall constitute grounds for immediate
              termination of the Employee's employment with the Company, without
              notice or payment in lieu of notice, notwithstanding any other
              provisions of the Employee's employment contract or offer letter.
            </li>
          </ul>
          <h2 className="fs-5 fw-semibold mb-3">
            9. GOVERNING LAW AND JURISDICTION:
          </h2>
          <p className="mb-4">
            This Agreement shall be governed by and construed in accordance with
            the substantive laws of India, without regard to its conflict of
            laws principles. The Parties irrevocably agree that any dispute,
            controversy, or claim arising out of or in connection with this
            Agreement, including its existence, validity, interpretation,
            performance, breach, or termination, shall be subject to the
            exclusive jurisdiction of the competent courts located in{" "}
            <strong>
              Noida
            </strong>
            , Uttar Pradesh, India.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">10. ENTIRE AGREEMENT:</h2>
          <p className="mb-4">
            This Agreement, along with the Employee's Offer Letter and
            Employment Contract, constitutes the entire agreement and
            understanding between the Parties concerning the subject matter
            hereof and supersedes all prior and contemporaneous agreements,
            understandings, negotiations, and discussions, whether oral or
            written, between the Parties relating to the Employee's
            confidentiality obligations, intellectual property assignments, and
            restrictive covenants.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">11. AMENDMENTS AND WAIVER:</h2>
          <p className="mb-4">
            Any amendment, modification, or waiver of any provision of this
            Agreement shall be effective only if made in writing and signed by
            duly authorized representatives of both Parties. No waiver of any
            breach of any provision of this Agreement shall be deemed a waiver
            of any subsequent breach or of any other provision.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">12. SEVERABILITY:</h2>
          <p className="mb-4">
            If any provision of this Agreement is found by a court of competent
            jurisdiction to be invalid, illegal, or unenforceable in any
            respect, the validity, legality, and enforceability of the remaining
            provisions contained herein shall not in any way be affected or
            impaired thereby, and such invalid, illegal, or unenforceable
            provision shall be reformed, construed, and enforced to the maximum
            extent permitted by law.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">13. ASSIGNMENT:</h2>
          <p className="mb-4">
            This Agreement is personal to the Employee and may not be assigned
            by the Employee. This Agreement shall be binding upon and inure to
            the benefit of the Company and its successors and assigns.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">14. ACKNOWLEDGMENT:</h2>
          <p className="mb-5">
            The Employee acknowledges that this Agreement is a material
            condition of employment and that the Employee has had ample
            opportunity to review this Agreement thoroughly, to understand its
            terms and implications, and to consult with independent legal
            counsel of their choice prior to signing. The Employee understands
            and voluntarily agrees to all terms and conditions contained herein.
          </p>
          <h2 className="fs-5 fw-semibold mb-3">IN WITNESS WHEREOF,</h2>
          <p className="mb-4">
            the Parties have executed this Agreement as of the Effective Date
            first written above.
          </p>
          <div className="row g-4">
            <div className="col-md-6">
              <h3 className="fs-6 fw-semibold mb-2">
                FOR {staffData?.userCompany?.companyName}:
              </h3>
              <p className="mb-1">
                {/* Signature:{" "} */}
                <span
                  className="d-inline-block border-bottom w-100"
                  style={{ height: "1.2em" }}
                />
              </p>
              <p className="mb-1">
                Name: <span>{staffData?.companyBranch?.contactPerson}</span>
              </p>
              <p className="mb-1">
                Title:{" "}
                <span >
                  {staffData?.companyBranch?.designation}
                </span>
              </p>
              <p className="mb-1">
                Date: {dayjs(staffData?.createdAt).format("DD-MM-YYYY")}
                {/* <span
                  className="d-inline-block border-bottom w-100"
                  style={{ height: "1.2em" }}
                /> */}
              </p>
              <div className="d-flex align-items-center">
                <p className="mb-1">
                Signature: 
                </p>
                <img src="/SignCEO.png" alt="" style={{width:"125px", height:"90px",objectFit:"contain"}} />
                
              
              </div>
              
              <span
                  className="d-inline-block border-bottom w-100"
                  style={{ height: "1.2em" }}
                />
            </div>
            <div className="col-md-6">
              <h3 className="fs-6 fw-semibold mb-2">EMPLOYEE:</h3>
              <p className="mb-1">
                <span
                  className="d-inline-block border-bottom w-100"
                  style={{ height: "1.2em" }}
                />
              </p>
              <p className="mb-1">Name: {staffData?.name}</p>
              <p>
                Date: {dayjs(staffData?.createdAt).format("DD-MM-YYYY")}
                <span
                  className="d-inline-block border-bottom w-100"
                  style={{ height: "1.2em" }}
                />
              </p>
              
              
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default GenerateNDA;
