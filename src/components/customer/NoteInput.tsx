import { Stack, Text, Textarea } from "@mantine/core";

interface NoteInputProps {
  label: string;
  note?: string;
  setNote: (note: string) => void;
}

function NoteInput({ label, note, setNote }: NoteInputProps) {
  return (
    <Stack w="100%" gap="3">
      <Text>{label}</Text>

      <Textarea
        w="100%"
        bdrs="sm"
        bd="darkslategray solid 1px"
        onChange={(e) => setNote(e.target.value)}
        value={note}
      />
    </Stack>
  );
}

export default NoteInput;
