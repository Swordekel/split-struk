import { useSplitStore } from '../store/useSplitStore'
import ReceiptUploader from '../components/ReceiptUploader'
import ItemEditor from '../components/ItemEditor'
import PeoplePicker from '../components/PeoplePicker'
import ItemTagger from '../components/ItemTagger'
import SummaryCard from '../components/SummaryCard'

export default function NewSplit() {
  const step = useSplitStore((s) => s.step)

  return (
    <>
      {step === 'upload' && <ReceiptUploader />}
      {step === 'items' && <ItemEditor />}
      {step === 'people' && <PeoplePicker />}
      {step === 'tag' && <ItemTagger />}
      {step === 'summary' && <SummaryCard />}
    </>
  )
}
