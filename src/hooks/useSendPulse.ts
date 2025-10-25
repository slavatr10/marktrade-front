import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setContactTag } from "@/api/sendpulse";

interface UseSendPulseTagReturn {
  sendTag: (contactId: string, tags: string[]) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
}

export const useSendPulseTag = (): UseSendPulseTagReturn => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ contactId, tags }: { contactId: string; tags: string[] }) => {
      const result = await setContactTag(contactId, tags);
      if (!result) {
        throw new Error("Помилка відправки тегу до SendPulse");
      }
      return result;
    },
    onSuccess: (_, { tags }) => {
      console.log(`Тег(и) '${tags.join(", ")}' успішно відправлено`);
      queryClient.invalidateQueries({ queryKey: ["sendpulse-tags"] });
    },
    onError: (error) => {
      console.error("Помилка відправки тегу:", error);
    },
  });

  const sendTag = async (contactId: string, tags: string[]) => {
    try {
      await mutation.mutateAsync({ contactId, tags });
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    sendTag,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};