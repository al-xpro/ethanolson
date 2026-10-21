import { Text } from "@react-email/components";
import { emailCopy } from "@/content/ui";
import { EmailLayout, styles } from "./layout";
import type { Enquiry } from "@/lib/email";

/** To the visitor: their message arrived, a copy of it, and who reads it */
export function ContactConfirmation({ enquiry }: { enquiry: Enquiry }) {
  const copy = emailCopy.confirmation;
  return (
    <EmailLayout preview={copy.body}>
      <Text style={styles.heading}>{copy.greeting(enquiry.name)}</Text>
      <Text style={styles.text}>{copy.body}</Text>
      <Text style={styles.label}>{copy.copyHeading}</Text>
      <Text style={styles.text}>{enquiry.message}</Text>
      <Text style={styles.label}>{emailCopy.notification.labels.call}</Text>
      <Text style={styles.text}>{enquiry.call}</Text>
      <Text style={{ ...styles.text, marginTop: "24px" }}>{copy.signature}</Text>
    </EmailLayout>
  );
}
