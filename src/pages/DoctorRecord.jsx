// // import { useState } from "react";
// // import Swal from "sweetalert2";
// // import Background from "../components/Background";
// // import Header from "../components/Header";

// // // ─────────────────────────────────────────────
// // // Google Calendar Helper
// // // ─────────────────────────────────────────────

// // function toGCalDate(thaiDateStr, timeStr) {
// //   const thaiMonths = {
// //     มกราคม: "01",
// //     กุมภาพันธ์: "02",
// //     มีนาคม: "03",
// //     เมษายน: "04",
// //     พฤษภาคม: "05",
// //     มิถุนายน: "06",
// //     กรกฎาคม: "07",
// //     สิงหาคม: "08",
// //     กันยายน: "09",
// //     ตุลาคม: "10",
// //     พฤศจิกายน: "11",
// //     ธันวาคม: "12",
// //   };

// //   const parts = thaiDateStr.trim().split(" ");
// //   const day = parts[0].padStart(2, "0");
// //   const month = thaiMonths[parts[1]] || "01";
// //   const year = String(parseInt(parts[2]) - 543);

// //   const [h, m] = timeStr.replace(" น.", "").split(":");
// //   const hour = (h || "09").padStart(2, "0");
// //   const min = (m || "00").padStart(2, "0");

// //   const startDT = `${year}${month}${day}T${hour}${min}00`;
// //   const endHour = String(parseInt(hour) + 1).padStart(2, "0");
// //   const endDT = `${year}${month}${day}T${endHour}${min}00`;

// //   return { startDT, endDT };
// // }

// // function openGoogleCalendar({ date, time, location, checkupName }) {
// //   const { startDT, endDT } = toGCalDate(date, time);

// //   const params = new URLSearchParams({
// //     action: "TEMPLATE",
// //     text: `🏥 นัดพบแพทย์ - ${checkupName}`,
// //     dates: `${startDT}/${endDT}`,
// //     details: `การตรวจ: ${checkupName}\nสถานที่: ${location}\nแอป: Smart DM`,
// //     location: location,
// //   });

// //   window.open(
// //     `https://calendar.google.com/calendar/render?${params}`,
// //     "_blank",
// //   );
// // }

// // // ─────────────────────────────────────────────
// // // Icons
// // // ─────────────────────────────────────────────

// // const CalendarIcon = () => (
// //   <svg
// //     width="20"
// //     height="20"
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="2"
// //     strokeLinecap="round"
// //     strokeLinejoin="round"
// //   >
// //     <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
// //     <line x1="16" y1="2" x2="16" y2="6" />
// //     <line x1="8" y1="2" x2="8" y2="6" />
// //     <line x1="3" y1="10" x2="21" y2="10" />
// //   </svg>
// // );

// // const ClockIcon = () => (
// //   <svg
// //     width="20"
// //     height="20"
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="2"
// //     strokeLinecap="round"
// //     strokeLinejoin="round"
// //   >
// //     <circle cx="12" cy="12" r="10" />
// //     <polyline points="12 6 12 12 16 14" />
// //   </svg>
// // );

// // const LocationIcon = () => (
// //   <svg
// //     width="20"
// //     height="20"
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="2"
// //     strokeLinecap="round"
// //     strokeLinejoin="round"
// //   >
// //     <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
// //     <circle cx="12" cy="10" r="3" />
// //   </svg>
// // );

// // const ClipboardIcon = () => (
// //   <svg
// //     width="20"
// //     height="20"
// //     viewBox="0 0 24 24"
// //     fill="none"
// //     stroke="currentColor"
// //     strokeWidth="2"
// //     strokeLinecap="round"
// //     strokeLinejoin="round"
// //   >
// //     <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
// //     <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
// //   </svg>
// // );

// // // ─────────────────────────────────────────────
// // // Main Component
// // // ─────────────────────────────────────────────

// // const APPOINTMENT = {
// //   date: "25 กุมภาพันธ์ 2567",
// //   time: "09:00 น.",
// //   location: "โรงพยาบาลศิริราช อาคารผู้ป่วยนอก",
// //   checkupName: "ตรวจเบาหวานประจำปี",
// // };

// // export default function DoctorRecord({ appointment = APPOINTMENT }) {
// //   const [confirmed, setConfirmed] = useState(false);

// //   const handleConfirm = () => {
// //     Swal.fire({
// //       title: "ยืนยันการนัดหมาย",
// //       html: `

// //         <p style="font-weight:600;color:#e05a7a;">${appointment.date} เวลา ${appointment.time}</p>
// //       `,
// //       icon: "question",
// //       showCancelButton: true,
// //       cancelButtonText: "ยกเลิก",
// //       confirmButtonText: "ยืนยัน",
// //       confirmButtonColor: "#e05a7a",
// //       cancelButtonColor: "#aaa",
// //       reverseButtons: true,
// //     }).then((result) => {
// //       if (!result.isConfirmed) return;
// //       setConfirmed(true);
// //       openGoogleCalendar(appointment);
// //     });
// //   };

// //   const handleCancelConfirm = () => {
// //     Swal.fire({
// //       title: "ยกเลิกการนัดหมาย",
// //       text: "คุณต้องการยกเลิกการนัดหมายนี้ใช่หรือไม่?",
// //       icon: "warning",
// //       showCancelButton: true,
// //       cancelButtonText: "ยกเลิก",
// //       confirmButtonText: "ยืนยัน",
// //       confirmButtonColor: "#e05a7a",
// //       cancelButtonColor: "#aaa",
// //       reverseButtons: true,
// //     }).then((result) => {
// //       if (result.isConfirmed) setConfirmed(false);
// //     });
// //   };

// //   const handleReschedule = () => {
// //     Swal.fire({
// //       title: "เลื่อนนัด",
// //       text: "ฟีเจอร์นี้กำลังพัฒนาอยู่ กรุณาติดต่อโรงพยาบาลโดยตรง",
// //       icon: "info",
// //       confirmButtonColor: "#e05a7a",
// //       confirmButtonText: "ตกลง",
// //     });
// //   };

// //   return (
// //     <div style={styles.page}>
// //       <div style={styles.card}>
// //         {/* Header */}
// //         <div style={styles.header}>
// //           <span style={styles.logoText}>Smart DM</span>
// //         </div>

// //         {/* Info Card */}
// //         <div style={styles.infoCard}>
// //           <div style={styles.infoTitle}>ใบนัดพบแพทย์</div>

// //           {confirmed && <div style={styles.confirmedBadge}>✓ ยืนยันแล้ว</div>}

// //           <div style={styles.divider} />

// //           <div style={styles.infoRow}>
// //             <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
// //               <CalendarIcon />
// //             </span>
// //             <span style={styles.infoText}>
// //               วันที่: <b>{appointment.date}</b>
// //             </span>
// //           </div>

// //           <div style={styles.infoRow}>
// //             <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
// //               <ClockIcon />
// //             </span>
// //             <span style={styles.infoText}>
// //               เวลา: <b>{appointment.time}</b>
// //             </span>
// //           </div>

// //           <div style={styles.divider} />

// //           <div style={styles.infoRow}>
// //             <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
// //               <LocationIcon />
// //             </span>
// //             <span style={styles.infoText}>
// //               สถานที่: <b>{appointment.location}</b>
// //             </span>
// //           </div>

// //           <div style={styles.infoRow}>
// //             <span style={{ ...styles.infoIcon, color: "#e05a7a" }}>
// //               <ClipboardIcon />
// //             </span>
// //             <span style={styles.infoText}>
// //               ชื่อการตรวจ: <b>{appointment.checkupName}</b>
// //             </span>
// //           </div>
// //         </div>

// //         {/* Buttons */}
// //         {!confirmed ? (
// //           <button onClick={handleConfirm} style={styles.btnConfirm}>
// //             ยืนยันการนัดหมาย
// //           </button>
// //         ) : (
// //           <button onClick={handleCancelConfirm} style={styles.btnCancelConfirm}>
// //             ยกเลิกการนัดหมาย
// //           </button>
// //         )}

// //         <button onClick={handleReschedule} style={styles.btnReschedule}>
// //           เลื่อนนัด
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // ─────────────────────────────────────────────
// // // Styles
// // // ─────────────────────────────────────────────

// // const styles = {
// //   page: {
// //     minHeight: "100vh",
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
// //     padding: "20px",
// //     fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
// //   },
// //   card: {
// //     background: "#fce4ec",
// //     borderRadius: "24px",
// //     padding: "24px 20px",
// //     width: "100%",
// //     maxWidth: "340px",
// //     boxShadow: "0 8px 32px rgba(224,90,122,0.18)",
// //     display: "flex",
// //     flexDirection: "column",
// //     gap: "12px",
// //   },
// //   header: {
// //     display: "flex",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     marginBottom: "4px",
// //   },
// //   logoText: {
// //     fontSize: "2rem",
// //     fontWeight: "800",
// //     color: "#e05a7a",
// //     fontFamily: "Georgia, serif",
// //     lineHeight: 1,
// //   },
// //   infoCard: {
// //     background: "white",
// //     borderRadius: "16px",
// //     padding: "16px",
// //     boxShadow: "0 2px 12px rgba(224,90,122,0.08)",
// //     display: "flex",
// //     flexDirection: "column",
// //     gap: "10px",
// //   },
// //   infoTitle: {
// //     fontSize: "1.1rem",
// //     fontWeight: "700",
// //     color: "#2d2d2d",
// //   },
// //   confirmedBadge: {
// //     display: "inline-block",
// //     background: "#dcfce7",
// //     color: "#16a34a",
// //     borderRadius: "99px",
// //     padding: "2px 12px",
// //     fontSize: "0.8rem",
// //     fontWeight: "600",
// //     width: "fit-content",
// //   },
// //   divider: {
// //     height: "1px",
// //     background: "#f3e0e5",
// //     margin: "2px 0",
// //   },
// //   infoRow: {
// //     display: "flex",
// //     alignItems: "flex-start",
// //     gap: "10px",
// //   },
// //   infoIcon: {
// //     flexShrink: 0,
// //     marginTop: "1px",
// //   },
// //   infoText: {
// //     fontSize: "0.92rem",
// //     color: "#444",
// //     lineHeight: 1.5,
// //   },
// //   btnConfirm: {
// //     width: "100%",
// //     padding: "14px",
// //     borderRadius: "99px",
// //     border: "none",
// //     background: "linear-gradient(135deg, #e05a7a, #c2185b)",
// //     color: "white",
// //     fontSize: "1rem",
// //     fontWeight: "700",
// //     cursor: "pointer",
// //     boxShadow: "0 4px 14px rgba(224,90,122,0.35)",
// //     transition: "all 0.2s",
// //   },
// //   btnConfirmed: {
// //     background: "linear-gradient(135deg, #a8d5a2, #66bb6a)",
// //     boxShadow: "0 4px 14px rgba(102,187,106,0.3)",
// //     cursor: "default",
// //   },
// //   btnCancelConfirm: {
// //     width: "100%",
// //     padding: "14px",
// //     borderRadius: "99px",
// //     border: "2px solid #aaa",
// //     background: "white",
// //     color: "#888",
// //     fontSize: "1rem",
// //     fontWeight: "600",
// //     cursor: "pointer",
// //     transition: "all 0.2s",
// //   },
// //   btnReschedule: {
// //     width: "100%",
// //     padding: "13px",
// //     borderRadius: "99px",
// //     border: "none",
// //     background: "#e0e0e0",
// //     color: "#666",
// //     fontSize: "1rem",
// //     fontWeight: "600",
// //     cursor: "pointer",
// //     transition: "all 0.2s",
// //   },
// // };

// import { useState } from "react";
// import Swal from "sweetalert2";
// import Background from "../components/Background";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// // ─── Google Calendar Helper ───────────────────

// function toGCalDate(thaiDateStr, timeStr) {
//   const thaiMonths = {
//     มกราคม: "01", กุมภาพันธ์: "02", มีนาคม: "03",
//     เมษายน: "04", พฤษภาคม: "05", มิถุนายน: "06",
//     กรกฎาคม: "07", สิงหาคม: "08", กันยายน: "09",
//     ตุลาคม: "10", พฤศจิกายน: "11", ธันวาคม: "12",
//   };
//   const [d, m, y] = thaiDateStr.trim().split(" ");
//   const day = d.padStart(2, "0");
//   const month = thaiMonths[m] || "01";
//   const year = String(parseInt(y) - 543);
//   const [h, min] = timeStr.replace(" น.", "").split(":");
//   const hour = (h || "09").padStart(2, "0");
//   const minute = (min || "00").padStart(2, "0");
//   const endHour = String(parseInt(hour) + 1).padStart(2, "0");
//   return {
//     startDT: `${year}${month}${day}T${hour}${minute}00`,
//     endDT:   `${year}${month}${day}T${endHour}${minute}00`,
//   };
// }

// function openGoogleCalendar({ date, time, location, checkupName }) {
//   const { startDT, endDT } = toGCalDate(date, time);
//   const params = new URLSearchParams({
//     action: "TEMPLATE",
//     text: `🏥 นัดพบแพทย์ - ${checkupName}`,
//     dates: `${startDT}/${endDT}`,
//     details: `การตรวจ: ${checkupName}\nสถานที่: ${location}\nแอป: Smart DM`,
//     location,
//   });
//   window.open(`https://calendar.google.com/calendar/render?${params}`, "_blank");
// }

// // ─── Icons ────────────────────────────────────

// const Icon = ({ d, circle, points, rect, line1, line2, line3 }) => (
//   <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     {d && <path d={d} />}
//     {circle && <circle {...circle} />}
//     {points && <polyline points={points} />}
//     {rect && <rect {...rect} />}
//     {line1 && <line {...line1} />}
//     {line2 && <line {...line2} />}
//     {line3 && <line {...line3} />}
//   </svg>
// );

// const CalendarIcon = () => (
//   <Icon
//     rect={{ x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }}
//     line1={{ x1: 16, y1: 2, x2: 16, y2: 6 }}
//     line2={{ x1: 8, y1: 2, x2: 8, y2: 6 }}
//     line3={{ x1: 3, y1: 10, x2: 21, y2: 10 }}
//   />
// );

// const ClockIcon = () => (
//   <Icon circle={{ cx: 12, cy: 12, r: 10 }} points="12 6 12 12 16 14" />
// );

// const LocationIcon = () => (
//   <Icon d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" circle={{ cx: 12, cy: 10, r: 3 }} />
// );

// const ClipboardIcon = () => (
//   <Icon d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" 
//     rect={{ x: 8, y: 2, width: 8, height: 4, rx: 1, ry: 1 }} />
// );

// // ─── Sub-components ───────────────────────────

// function InfoRow({ icon, label, value }) {
//   return (
//     <div style={styles.infoRow}>
//       <span style={styles.infoIcon}>{icon}</span>
//       <span style={styles.infoText}>
//         {label}: <b>{value}</b>
//       </span>
//     </div>
//   );
// }

// function Divider() {
//   return <div style={styles.divider} />;
// }

// // ─── Default Data ─────────────────────────────

// const DEFAULT_APPOINTMENT = {
//   date: "25 กุมภาพันธ์ 2567",
//   time: "09:00 น.",
//   location: "โรงพยาบาลศิริราช อาคารผู้ป่วยนอก",
//   checkupName: "ตรวจเบาหวานประจำปี",
// };

// // ─── Main Component ───────────────────────────

// export default function DoctorRecord({ appointment = DEFAULT_APPOINTMENT }) {
//   const [confirmed, setConfirmed] = useState(false);

//   const handleConfirm = () => {
//     Swal.fire({
//       title: "ยืนยันการนัดหมาย",
//       html: `<p style="font-weight:600;color:#17BCBC;">${appointment.date} เวลา ${appointment.time}</p>`,
//       icon: "question",
//       showCancelButton: true,
//       cancelButtonText: "ยกเลิก",
//       confirmButtonText: "ยืนยัน",
//       confirmButtonColor: "#17BCBC",
//       cancelButtonColor: "#aaa",
//       reverseButtons: true,
//     }).then((result) => {
//       if (!result.isConfirmed) return;
//       setConfirmed(true);
//       openGoogleCalendar(appointment);
//     });
//   };

//   const handleCancelConfirm = () => {
//     Swal.fire({
//       title: "ยกเลิกการนัดหมาย",
//       text: "คุณต้องการยกเลิกการนัดหมายนี้ใช่หรือไม่?",
//       icon: "warning",
//       showCancelButton: true,
//       cancelButtonText: "ยกเลิก",
//       confirmButtonText: "ยืนยัน",
//       confirmButtonColor: "#17BCBC",
//       cancelButtonColor: "#aaa",
//       reverseButtons: true,
//     }).then((result) => {
//       if (result.isConfirmed) setConfirmed(false);
//     });
//   };

//   const handleReschedule = () => {
//     Swal.fire({
//       title: "เลื่อนนัด",
//       text: "ฟีเจอร์นี้กำลังพัฒนาอยู่ กรุณาติดต่อโรงพยาบาลโดยตรง",
//       icon: "info",
//       confirmButtonColor: "#17BCBC",
//       confirmButtonText: "ตกลง",
//     });
//   };

//   return (
//     <Background>
//       <div style={styles.card}>
//         <Header title="บันทึกนัดพบแพทย์" backTo="/menu" />

//         <div style={styles.inner}>
//           {/* Info Card */}
//           <div style={styles.infoCard}>
//             <div style={styles.infoTitle}>ใบนัดพบแพทย์</div>

//             {confirmed && (
//               <div style={styles.confirmedBadge}>✓ ยืนยันแล้ว</div>
//             )}

//             <Divider />
//             <InfoRow icon={<CalendarIcon />} label="วันที่"      value={appointment.date} />
//             <InfoRow icon={<ClockIcon />}    label="เวลา"        value={appointment.time} />
//             <Divider />
//             <InfoRow icon={<LocationIcon />} label="สถานที่"     value={appointment.location} />
//             <InfoRow icon={<ClipboardIcon />}label="ชื่อการตรวจ" value={appointment.checkupName} />
//           </div>

//           {/* Buttons */}
//           {!confirmed ? (
//             <button onClick={handleConfirm} style={styles.btnConfirm}>
//               ยืนยันการนัดหมาย
//             </button>
//           ) : (
//             <button onClick={handleCancelConfirm} style={styles.btnCancelConfirm}>
//               ยกเลิกการนัดหมาย
//             </button>
//           )}

//           <button onClick={handleReschedule} style={styles.btnReschedule}>
//             เลื่อนนัด
//           </button>
//         </div>
//       </div>
//       <Footer />
//     </Background>
//   );
// }

// // ─── Styles ───────────────────────────────────

// const styles = {
//   card: {
//     background: "white",
//     borderRadius: "24px",
//     width: "100%",
//     maxWidth: "420px",
//     boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
//     overflow: "hidden",
//   },
//   inner: {
//     padding: "16px 20px 24px",
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   },
//   infoCard: {
//     background: "#f8fffe",
//     borderRadius: "16px",
//     padding: "16px",
//     border: "1px solid #e0f5f5",
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//   },
//   infoTitle: {
//     fontSize: "1.1rem",
//     fontWeight: "700",
//     color: "#2d2d2d",
//   },
//   confirmedBadge: {
//     display: "inline-block",
//     background: "#dcfce7",
//     color: "#16a34a",
//     borderRadius: "99px",
//     padding: "2px 12px",
//     fontSize: "0.8rem",
//     fontWeight: "600",
//     width: "fit-content",
//   },
//   divider: {
//     height: "1px",
//     background: "#e0f5f5",
//     margin: "2px 0",
//   },
//   infoRow: {
//     display: "flex",
//     alignItems: "flex-start",
//     gap: "10px",
//   },
//   infoIcon: {
//     flexShrink: 0,
//     marginTop: "1px",
//     color: "#17BCBC",
//   },
//   infoText: {
//     fontSize: "0.92rem",
//     color: "#444",
//     lineHeight: 1.5,
//   },
//   btnConfirm: {
//     width: "100%",
//     padding: "14px",
//     borderRadius: "99px",
//     border: "none",
//     background: "linear-gradient(135deg, #64C5D7, #17BCBC)",
//     color: "white",
//     fontSize: "1rem",
//     fontWeight: "700",
//     cursor: "pointer",
//     boxShadow: "0 4px 14px rgba(23,188,188,0.35)",
//   },
//   btnCancelConfirm: {
//     width: "100%",
//     padding: "14px",
//     borderRadius: "99px",
//     border: "2px solid #aaa",
//     background: "white",
//     color: "#888",
//     fontSize: "1rem",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
//   btnReschedule: {
//     width: "100%",
//     padding: "13px",
//     borderRadius: "99px",
//     border: "none",
//     background: "#e0e0e0",
//     color: "#666",
//     fontSize: "1rem",
//     fontWeight: "600",
//     cursor: "pointer",
//   },
// };

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DoctorFormPage from "./DoctorFormPage";

// ─── Icons ────────────────────────────────────

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const CalendarIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ClockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ClipboardIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

// ─── Appointment Card ─────────────────────────

function AppointmentCard({ appointment, onClick }) {
  const isConfirmed = appointment.confirmed;

  return (
    <button onClick={onClick} style={styles.card}>
      {/* Left accent bar */}
      <div style={{
        ...styles.cardAccent,
        background: isConfirmed
          ? "linear-gradient(180deg, #17BCBC, #64C5D7)"
          : "linear-gradient(180deg, #b0b0b0, #d0d0d0)",
      }} />

      {/* Content */}
      <div style={styles.cardContent}>
        <div style={styles.cardTop}>
          <div style={styles.cardCheckupName}>{appointment.checkupName}</div>
          {isConfirmed && (
            <span style={styles.confirmedBadge}>&#10003; ยืนยันแล้ว</span>
          )}
        </div>

        <div style={styles.cardMeta}>
          <span style={styles.metaItem}>
            <CalendarIcon />
            <span>{appointment.date}</span>
          </span>
          <span style={styles.metaDot}>·</span>
          <span style={styles.metaItem}>
            <ClockIcon />
            <span>{appointment.time}</span>
          </span>
        </div>

        <div style={styles.cardLocation}>
          <ClipboardIcon />
          <span>{appointment.location}</span>
        </div>
      </div>

      {/* Arrow */}
      <div style={styles.cardArrow}>
        <ChevronIcon />
      </div>
    </button>
  );
}

// ─── Empty State ──────────────────────────────

function EmptyState() {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>
        <CalendarIcon size={32} />
      </div>
      <p style={styles.emptyText}>กรุณาเพิ่มบันทึกใบนัดพบแพทย์</p>
      <p style={styles.emptySubtext}>แตะปุ่ม + มุมขวาบนเพื่อเพิ่มนัดหมายใหม่</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────

export default function DoctorRecord() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const handleAddAppointment = (newAppointment) => {
    setAppointments((prev) => [
      { ...newAppointment, id: Date.now(), confirmed: false },
      ...prev,
    ]);
    setShowForm(false);
  };

  const handleCardClick = (appointment) => {
    navigate("/doctor-record/detail", { state: { appointment } });
  };

  return (
    <Background>
      <div style={styles.page}>
        {/* Header */}
        <Header title="บันทึกนัดพบแพทย์" backTo="/menu" />

        {/* Sub-bar: ปุ่ม + เพิ่ม ชิดขวา ใต้ Header */}
        {!showForm && (
          <div style={styles.subBar}>
            <button
              style={styles.addBtn}
              onClick={() => setShowForm(true)}
            >
              <PlusIcon />
              <span>เพิ่ม</span>
            </button>
          </div>
        )}

        {/* Card List */}
        {!showForm && (
          <div style={styles.listContainer}>
            {appointments.length === 0 ? (
              <EmptyState />
            ) : (
              <div style={styles.list}>
                {appointments.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    onClick={() => handleCardClick(appt)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Form — rendered inline inside the same card */}
        {showForm && (
          <DoctorFormPage
            onSubmit={handleAddAppointment}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      <Footer />
    </Background>
  );
}

// ─── Styles ───────────────────────────────────

const styles = {
  page: {
    background: "white",
    borderRadius: "24px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: "520px",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },

  // Sub-bar ใต้ Header
  subBar: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px 16px 4px",
    borderBottom: "1px solid #f0fafa",
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "7px 16px",
    borderRadius: "99px",
    border: "1.5px solid #17BCBC",
    background: "white",
    color: "#17BCBC",
    fontSize: "0.88rem",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },

  listContainer: {
    padding: "14px 16px 16px",
    flex: 1,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  // Card
  card: {
    width: "100%",
    background: "#f8fffe",
    border: "1px solid #e0f5f5",
    borderRadius: "16px",
    padding: "14px 12px 14px 0",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },
  cardAccent: {
    width: "4px",
    alignSelf: "stretch",
    borderRadius: "0 4px 4px 0",
    marginRight: "12px",
    flexShrink: 0,
  },
  cardContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  cardCheckupName: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  confirmedBadge: {
    background: "#dcfce7",
    color: "#16a34a",
    borderRadius: "99px",
    padding: "1px 8px",
    fontSize: "0.72rem",
    fontWeight: "600",
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.8rem",
    color: "#17BCBC",
  },
  metaDot: {
    color: "#ccc",
    fontSize: "0.8rem",
  },
  cardLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.78rem",
    color: "#888",
  },
  cardArrow: {
    color: "#ccc",
    flexShrink: 0,
    marginLeft: "4px",
  },

  // Empty state
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "10px",
  },
  emptyIcon: {
    color: "#c5e8e8",
    marginBottom: "4px",
  },
  emptyText: {
    fontSize: "0.95rem",
    color: "#aaa",
    fontWeight: "600",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },
  emptySubtext: {
    fontSize: "0.8rem",
    color: "#ccc",
    fontFamily: "'Sarabun', 'Noto Sans Thai', sans-serif",
  },
};