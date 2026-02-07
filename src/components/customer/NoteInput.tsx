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
        bd="darkslategray solid 1px"
        bdrs="sm"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </Stack>
  );
}

export default NoteInput;
