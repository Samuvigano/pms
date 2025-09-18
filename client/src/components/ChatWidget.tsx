import { useCallback, useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";

interface ChatMessage {
	role: "user" | "assistant";
	content: string;
}

const ChatWidget = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [input, setInput] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, isOpen]);

	const handleSend = useCallback(async () => {
		const trimmed = input.trim();
		if (!trimmed || isSending) return;

		setIsSending(true);
		setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);
		setInput("");

		try {
			const response = await fetch("/api/v1/ai/stream", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ prompt: trimmed }),
			});

			if (!response.ok || !response.body) {
				throw new Error("Failed to connect to AI");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let done = false;

			while (!done) {
				const { value, done: doneReading } = await reader.read();
				done = doneReading;
				const chunkValue = decoder.decode(value || new Uint8Array(), { stream: !done });
				if (chunkValue) {
					setMessages((prev) => {
						const updated = [...prev];
						const lastIndex = updated.length - 1;
						if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
							updated[lastIndex] = {
								role: "assistant",
								content: updated[lastIndex].content + chunkValue,
							};
						}
						return updated;
					});
				}
			}
		} catch (err) {
			setMessages((prev) => [
				...prev,
				{ role: "assistant", content: "Sorry, I couldn't complete that request." },
			]);
		} finally {
			setIsSending(false);
		}
	}, [input, isSending]);

	const onKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend]
	);

	return (
		<>
			<Button
				onClick={() => setIsOpen(true)}
				className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg"
				variant="default"
			>
				<MessageCircle className="h-5 w-5" />
			</Button>

			<Sheet open={isOpen} onOpenChange={setIsOpen}>
				<SheetContent side="right" className="w-[380px] sm:w-[420px] p-0">
					<div className="flex h-full flex-col">
						<SheetHeader className="px-4 py-3 border-b">
							<SheetTitle>AI Assistant</SheetTitle>
							<SheetDescription>
								Chat with AI to get help with your property management tasks
							</SheetDescription>
						</SheetHeader>
						<div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
							{messages.length === 0 ? (
								<div className="text-sm text-muted-foreground">Ask me anything about your dashboard or data.</div>
							) : (
								messages.map((m, idx) => (
									<div key={idx} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
										<div
											className={
												"max-w-[85%] rounded-2xl px-3 py-2 text-sm " +
												(m.role === "user"
													? "bg-primary/10 text-primary"
													: "bg-muted text-foreground")
											}
										>
											{m.content}
										</div>
									</div>
								))
							)}
						</div>
						<div className="border-t p-3">
							<div className="flex items-center gap-2">
								<Input
									placeholder="Type a message..."
									value={input}
									onChange={(e) => setInput(e.target.value)}
									onKeyDown={onKeyDown}
									disabled={isSending}
								/>
								<Button onClick={handleSend} disabled={isSending || !input.trim()}>
									Send
								</Button>
							</div>
						</div>
					</div>
				</SheetContent>
			</Sheet>
		</>
	);
};

export default ChatWidget; 