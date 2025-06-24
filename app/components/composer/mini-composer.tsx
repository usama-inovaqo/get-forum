import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/outline";
import { ComposedMessage, ComposerVariant } from "./composer.types";
import { trimEmailBody } from "@/app/utils/trim-email-body";

type MiniComposerProps = {
  variant: ComposerVariant;
  composedMessage: ComposedMessage;
  onChange: (composedMessage: ComposedMessage) => void;
  onSendMessage: () => void;
  sending: boolean;
  disabledForm?: boolean;
  disabledSend?: boolean;
};

export default function MiniComposer({
  variant,
  composedMessage,
  onChange,
  onSendMessage,
  sending,
  disabledForm,
  disabledSend,
}: MiniComposerProps) {
  // display trimmed body if variant is full, otherwise display the full body
  const trimmedBody =
    variant === "full"
      ? trimEmailBody(composedMessage.body)
      : composedMessage.body;

  return (
    <form
      className={`flex gap-2 items-center rounded-full bg-white text-black w-full ${
        disabledForm ? "opacity-50" : ""
      }`}
      onSubmit={(e) => {
        e.preventDefault();
        onSendMessage();
      }}
    >
      <input
        type="text"
        placeholder="New message"
        className="rounded-full w-full p-4 focus:outline-none"
        value={sending ? "Sending email..." : trimmedBody}
        onChange={(e) => onChange({ ...composedMessage, body: e.target.value })}
        disabled={disabledForm}
      />
      <FaceSmileIcon className="w-8 h-8" />
      <button type="submit" disabled={disabledSend}>
        <PaperAirplaneIcon className="w-8 h-8 -rotate-45 -translate-y-0.5" />
      </button>
    </form>
  );
}
