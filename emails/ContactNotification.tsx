import { Text } from "@react-email/components";
import { emailCopy } from "@/content/ui";
import { EmailLayout, styles } from "./layout";
import type { Enquiry } from "@/lib/email";

/** To me: everything the visitor sent. Replying answers them (reply-to is their address). */
export function ContactNotification({ enquiry }: { enquiry: Enquiry }) {
  const { labels } = emailCopy.notification;
  const rows: [string, string][] = [
    [labels.name, enquiry.name],
    [labels.email, enquiry.email],
    [labels.budget, enquiry.budget],
    [labels.call, enquiry.call],
    [labels.message, enquiry.message],
  ];
  return (
    <EmailLayout preview={emailCopy.notification.subject(enquiry.name)}>
      <Text style={styles.heading}>{emailCopy.notification.heading}</Text>
      {rows.map(([label, value]) => (
        <div key={label}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.text}>{value}</Text>
        </div>
      ))}
      <Text style={{ ...styles.muted, marginTop: "24px" }}>{emailCopy.notification.replyHint}</Text>
    </EmailLayout>
  );
}
