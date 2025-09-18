import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Copy, ChevronDown, X } from 'lucide-react';
import lampImage from '@/assets/lamp.jpg';

interface TicketRow {
	id: string;
	created_at: string;
	description: string | null;
	opened_by_phone_n: string | null; // some projects may use opened_by_phone_number
	latest: string | null;
	is_open: boolean | null;
}

const Tickets = () => {
	const [tickets, setTickets] = useState<TicketRow[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const { data, error } = await supabase
					.from('tickets')
					.select('*')
					.order('created_at', { ascending: false });
				if (error) {
					setError(`Supabase error: ${error.message}`);
				} else {
					setTickets((data as TicketRow[]) || []);
				}
			} catch (err) {
				console.error('Failed to load tickets:', err);
				setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
			}
			setLoading(false);
		};
		load();
	}, []);

	const getPhone = (row: Partial<TicketRow> & Record<string, any>) => {
		return (
			(row.opened_by_phone_n as string | undefined) ||
			row.opened_by_phone_number ||
			row.phone ||
			''
		);
	};

	const handleViewDetails = (ticket: TicketRow) => {
		setSelectedTicket(ticket);
		setSheetOpen(true);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString();
	};

	const truncateText = (text: string | null, maxLength: number = 50) => {
		if (!text) return 'No description';
		return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
	};

	const onRowKeyDown = (e: React.KeyboardEvent, ticket: TicketRow) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleViewDetails(ticket);
		}
	};

	const handleCopy = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			toast({ title: 'Copied', description: `${value} copied to clipboard` });
		} catch (err) {
			toast({ title: 'Copy failed', description: 'Could not copy to clipboard' });
		}
	};

	return (
		<div className="flex h-screen bg-white w-full">
			<Sidebar />
			<div className="flex-1 flex flex-col overflow-hidden">
				<Header />
				<div className="flex-1 overflow-auto p-6">
					<div className="mb-6">
						<h2 className="text-2xl font-semibold text-black mb-2">Tickets | Venezia Nord</h2>
					</div>

					{error && (
						<div className="mb-4 p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
							{error}
						</div>
					)}

					{/* Phone numbers dropdown */}
					<div className="mb-6 rounded-lg border border-black/10 bg-white">
						<Collapsible open={phoneDropdownOpen} onOpenChange={setPhoneDropdownOpen}>
							<CollapsibleTrigger asChild>
								<div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
									<div className="flex items-center justify-between">
										<h3 className="text-sm font-semibold text-black">Open a ticket via SMS</h3>
										<ChevronDown className={`h-4 w-4 transition-transform ${phoneDropdownOpen ? 'rotate-180' : ''}`} />
									</div>
								</div>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<div className="px-4 pb-4 border-t border-black/10">
									<div className="space-y-3 pt-3">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-black">+1 (555) 194-5342</p>
												<p className="text-xs text-zinc-500">maintenance number</p>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleCopy('+1 (555) 194-5342')}
												className="border-black text-black hover:bg-black hover:text-white"
											>
												<Copy className="h-4 w-4 mr-1" /> Copy
											</Button>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm font-medium text-black">+1 (571) 624-2105</p>
												<p className="text-xs text-zinc-500">housekeeper number</p>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={() => handleCopy('+1 (571) 624-2105')}
												className="border-black text-black hover:bg-black hover:text-white"
											>
												<Copy className="h-4 w-4 mr-1" /> Copy
											</Button>
										</div>
									</div>
								</div>
							</CollapsibleContent>
						</Collapsible>
					</div>

					<Card className="border border-black/10 shadow-none">
						<CardContent className="p-0">
							<Table className="table-fixed">
								<TableHeader>
									<TableRow className="border-b border-black/10">
										<TableHead className="text-xs uppercase tracking-wide text-zinc-500">Status</TableHead>
										<TableHead className="text-xs uppercase tracking-wide text-zinc-500">Description</TableHead>
										<TableHead className="text-xs uppercase tracking-wide text-zinc-500">Phone</TableHead>
										<TableHead className="text-xs uppercase tracking-wide text-zinc-500">Latest</TableHead>
										<TableHead className="text-xs uppercase tracking-wide text-zinc-500">Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{loading && (
										Array.from({ length: 5 }).map((_, idx) => (
											<TableRow key={idx} className="border-b border-black/5">
												<TableCell><Skeleton className="h-4 w-16" /></TableCell>
												<TableCell><Skeleton className="h-4 w-32" /></TableCell>
												<TableCell><Skeleton className="h-4 w-24" /></TableCell>
												<TableCell><Skeleton className="h-4 w-28" /></TableCell>
												<TableCell><Skeleton className="h-4 w-20" /></TableCell>
											</TableRow>
										))
									)}

									{!loading && tickets.map((ticket) => (
										<TableRow
											key={ticket.id}
											className="border-b border-black/5 cursor-pointer transition-colors hover:bg-zinc-50"
											onClick={() => handleViewDetails(ticket)}
											tabIndex={0}
											role="button"
											onKeyDown={(e) => onRowKeyDown(e, ticket)}
										>
											<TableCell className="whitespace-nowrap align-middle">
												<Badge className={ticket.is_open ? 'bg-black text-white' : 'bg-transparent border border-black text-black'}>
													{ticket.is_open ? 'Open' : 'Closed'}
												</Badge>
											</TableCell>
											<TableCell className="max-w-[320px] truncate align-middle">
												{truncateText(ticket.description, 80)}
											</TableCell>
											<TableCell className="max-w-[160px] truncate text-zinc-700 align-middle">
												{getPhone(ticket) || '-'}
											</TableCell>
											<TableCell className="max-w-[240px] truncate text-zinc-700 align-middle">
												{truncateText(ticket.latest, 40) || 'No updates'}
											</TableCell>
											<TableCell className="whitespace-nowrap text-zinc-500 text-sm align-middle">
												{formatDate(ticket.created_at)}
											</TableCell>
										</TableRow>
									))}

									{!loading && tickets.length === 0 && (
										<TableRow>
											<TableCell colSpan={5} className="text-center py-8 text-gray-500">
												No tickets found
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Ticket Details Sidebar */}
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent className="w-[380px] sm:w-[520px] border-l border-black/10">
					<SheetHeader>
						<SheetTitle className="text-base font-semibold">Ticket Details</SheetTitle>
						<SheetDescription className="text-xs text-zinc-500">
							ID: {selectedTicket?.id}
						</SheetDescription>
					</SheetHeader>
					
					{selectedTicket && (
						<div className="mt-4 space-y-5">
							<div className="flex items-center justify-between">
								<Badge className={selectedTicket.is_open ? 'bg-black text-white' : 'bg-transparent border border-black text-black'}>
									{selectedTicket.is_open ? 'Open' : 'Closed'}
								</Badge>
								<span className="text-xs text-zinc-500">{new Date(selectedTicket.created_at).toLocaleString()}</span>
							</div>

							{/* Image Section */}
							<div className="space-y-2">
								<h4 className="text-sm font-medium text-zinc-500">Related Image</h4>
								<div className="rounded-lg overflow-hidden border border-black/10 cursor-pointer hover:opacity-80 transition-opacity">
									<img 
										src={lampImage} 
										alt="Ticket related image" 
										className="w-full h-48 object-cover"
										onClick={() => setImageModalOpen(true)}
									/>
								</div>
								<p className="text-xs text-zinc-400">Click image to view full size</p>
							</div>

							<div className="space-y-2">
								<h4 className="text-sm font-medium text-zinc-500">Description</h4>
								<p className="text-[15px] leading-relaxed text-black">
									{selectedTicket.description || 'No description provided'}
								</p>
							</div>

							<div className="space-y-1">
								<h4 className="text-sm font-medium text-zinc-500">Contact Phone</h4>
								<p className="text-sm text-zinc-700">
									{getPhone(selectedTicket) || 'No phone number provided'}
								</p>
							</div>

							<div className="space-y-1">
								<h4 className="text-sm font-medium text-zinc-500">Latest Update</h4>
								<p className="text-sm text-zinc-700 leading-relaxed">
									{selectedTicket.latest || 'No recent updates'}
								</p>
							</div>

							<div className="pt-4 border-t border-black/10">
								<div className="flex gap-2">
									<Button 
										variant="outline" 
										size="sm"
										onClick={() => setSheetOpen(false)}
										className="border-black text-black hover:bg-black hover:text-white"
									>
										Close
										</Button>
									<Button size="sm" className="bg-black text-white hover:bg-black/80">
										{selectedTicket.is_open ? 'Mark as Closed' : 'Reopen Ticket'}
									</Button>
								</div>
							</div>
						</div>
					)}
				</SheetContent>
			</Sheet>

			{/* Image Modal */}
			<Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
				<DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95 border-0">
					<div className="relative">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setImageModalOpen(false)}
							className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 h-8 w-8 p-0"
						>
							<X className="h-4 w-4" />
						</Button>
						<img 
							src={lampImage} 
							alt="Ticket related image - full size" 
							className="w-full h-auto max-h-[90vh] object-contain"
						/>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default Tickets; 