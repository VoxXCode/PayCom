/**
 * PayCom Rig Builder - Global State Context
 * Manages the component build state, selections, and compatibility
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  PCComponent,
  COMPONENTS,
  ALTERNATIVE_MOTHERBOARDS_AM5,
  CASE_OPTIONS,
  ALTERNATIVE_PROCESSORS,
  ALTERNATIVE_GPUS,
  ALTERNATIVE_RAMS,
  ALTERNATIVE_STORAGES,
  ALTERNATIVE_PSUS,
  ALTERNATIVE_COOLERS,
  INITIAL_SAVED_BUILDS,
  type SavedBuildItem,
  calculateTotals,
  type ComponentStatus,
} from '@/constants/data';

export type ActiveTab = 'home' | 'builder' | 'saved-builds' | 'benchmarks' | 'community';

interface BuildState {
  components: PCComponent[];
  activeTab: ActiveTab;
  selectedSlot: number | null;
  showSwapModal: boolean;
  swapCategory: string | null;
  swapOptions: PCComponent[];
  totals: ReturnType<typeof calculateTotals>;
  savedBuilds: SavedBuildItem[];
}

interface BuildContextType extends BuildState {
  setActiveTab: (tab: ActiveTab) => void;
  selectSlot: (slot: number | null) => void;
  removeComponent: (id: string) => void;
  swapComponent: (oldId: string, newComponent: PCComponent) => void;
  openSwapModal: (category: string) => void;
  closeSwapModal: () => void;
  resolveConflictAM5: () => void;
  selectCase: (caseComponent: PCComponent) => void;
  resetBuild: () => void;
  applyPreset: (presetId: string) => void;
  saveBuild: () => void;
}

const BuildContext = createContext<BuildContextType | null>(null);

export function BuildProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<PCComponent[]>(COMPONENTS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapCategory, setSwapCategory] = useState<string | null>(null);
  const [swapOptions, setSwapOptions] = useState<PCComponent[]>([]);
  const [savedBuilds, setSavedBuilds] = useState<SavedBuildItem[]>(INITIAL_SAVED_BUILDS);

  const totals = useMemo(() => calculateTotals(components), [components]);

  const selectSlot = useCallback((slot: number | null) => {
    setSelectedSlot(slot);
  }, []);

  const removeComponent = useCallback((id: string) => {
    setComponents(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            name: 'Belum Dipilih',
            price: 0,
            status: 'empty' as ComponentStatus,
            specs: `Pilih ${c.category} untuk slot ini`,
            tags: [],
            conflictMessage: undefined,
            image: undefined,
          };
        }
        // If removing CPU, also clear motherboard conflict
        if (id.startsWith('cpu') && c.id.startsWith('mobo') && c.status === 'incompatible') {
          return { ...c, status: 'compatible' as ComponentStatus, conflictMessage: undefined };
        }
        return c;
      })
    );
  }, []);

  const swapComponent = useCallback((oldId: string, newComponent: PCComponent) => {
    setComponents(prev => {
      const updated = prev.map(c => {
        if (c.id === oldId) {
          return { ...newComponent, slot: c.slot, slotLabel: c.slotLabel };
        }
        return c;
      });
      // Re-check compatibility: if mobo is now AM5, clear CPU conflict
      const cpu = updated.find(c => c.slot === 1);
      const mobo = updated.find(c => c.slot === 2);
      if (cpu && mobo && cpu.socket === mobo.socket) {
        return updated.map(c => {
          if (c.slot === 1 || c.slot === 2) {
            return { ...c, status: 'compatible' as ComponentStatus, conflictMessage: undefined };
          }
          return c;
        });
      }
      return updated;
    });
    setShowSwapModal(false);
  }, []);

  const openSwapModal = useCallback((category: string) => {
    setSwapCategory(category);
    if (category === 'Motherboard') {
      setSwapOptions(ALTERNATIVE_MOTHERBOARDS_AM5);
    } else if (category === 'Processor') {
      setSwapOptions(ALTERNATIVE_PROCESSORS);
    } else if (category === 'Kartu Grafis') {
      setSwapOptions(ALTERNATIVE_GPUS);
    } else if (category === 'RAM') {
      setSwapOptions(ALTERNATIVE_RAMS);
    } else if (category === 'Storage') {
      setSwapOptions(ALTERNATIVE_STORAGES);
    } else if (category === 'Power Supply') {
      setSwapOptions(ALTERNATIVE_PSUS);
    } else if (category === 'CPU Cooler') {
      setSwapOptions(ALTERNATIVE_COOLERS);
    } else if (category === 'Chassis Case') {
      setSwapOptions(CASE_OPTIONS);
    } else {
      setSwapOptions([]);
    }
    setShowSwapModal(true);
  }, []);

  const closeSwapModal = useCallback(() => {
    setShowSwapModal(false);
    setSwapCategory(null);
    setSwapOptions([]);
  }, []);

  const resolveConflictAM5 = useCallback(() => {
    openSwapModal('Motherboard');
  }, [openSwapModal]);

  const selectCase = useCallback((caseComponent: PCComponent) => {
    setComponents(prev =>
      prev.map(c => {
        if (c.slot === 8) {
          return { ...caseComponent, slot: 8, slotLabel: c.slotLabel };
        }
        return c;
      })
    );
    setShowSwapModal(false);
  }, []);

  const resetBuild = useCallback(() => {
    setComponents(COMPONENTS);
    setSelectedSlot(null);
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    // Basic mock logic: just slightly shuffle or modify for demo purposes
    if (presetId === 'gaming-4k') {
      const mockRig = [
        { ...ALTERNATIVE_PROCESSORS[0], slot: 1, slotLabel: 'SLOT 01 // CPU' },
        { ...ALTERNATIVE_MOTHERBOARDS_AM5[0], slot: 2, slotLabel: 'SLOT 02 // MOBO' },
        { ...ALTERNATIVE_GPUS[0], slot: 3, slotLabel: 'SLOT 03 // GPU' },
        { ...ALTERNATIVE_RAMS[0], slot: 4, slotLabel: 'SLOT 04 // MEMORY' },
        { ...ALTERNATIVE_STORAGES[0], slot: 5, slotLabel: 'SLOT 05 // NVME SSD' },
        { ...ALTERNATIVE_PSUS[0], slot: 6, slotLabel: 'SLOT 06 // PSU' },
        { ...ALTERNATIVE_COOLERS[0], slot: 7, slotLabel: 'SLOT 07 // AIO COOLER' },
        { ...CASE_OPTIONS[0], slot: 8, slotLabel: 'SLOT 08 // CHASIS CASE' },
      ];
      setComponents(mockRig);
    } else if (presetId === 'ai-deep') {
      const mockRig = [
        { ...ALTERNATIVE_PROCESSORS[1], slot: 1, slotLabel: 'SLOT 01 // CPU' },
        { ...ALTERNATIVE_MOTHERBOARDS_AM5[1], slot: 2, slotLabel: 'SLOT 02 // MOBO', socket: 'LGA1700' },
        { ...ALTERNATIVE_GPUS[1], slot: 3, slotLabel: 'SLOT 03 // GPU', name: 'NVIDIA RTX 4090 24GB', price: 35000000 },
        { ...ALTERNATIVE_RAMS[0], slot: 4, slotLabel: 'SLOT 04 // MEMORY' },
        { ...ALTERNATIVE_STORAGES[0], slot: 5, slotLabel: 'SLOT 05 // NVME SSD' },
        { ...ALTERNATIVE_PSUS[0], slot: 6, slotLabel: 'SLOT 06 // PSU' },
        { ...ALTERNATIVE_COOLERS[0], slot: 7, slotLabel: 'SLOT 07 // AIO COOLER' },
        { ...CASE_OPTIONS[1], slot: 8, slotLabel: 'SLOT 08 // CHASIS CASE' },
      ];
      setComponents(mockRig);
    } else {
      setComponents(COMPONENTS);
    }
  }, []);

  const saveBuild = useCallback(() => {
    const activeCount = components.filter(c => c.status !== 'empty').length;
    const isDraft = activeCount < components.length;
    
    const newSavedBuild: SavedBuildItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Custom Build - ${new Date().toLocaleDateString('id-ID')}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      components: activeCount,
      price: totals.grandTotal,
      status: isDraft ? 'Draft' : 'Lengkap',
      statusColor: isDraft ? '#aec6ff' : '#00f0ff',
      icon: '⚙️',
    };
    
    setSavedBuilds(prev => [newSavedBuild, ...prev]);
    setActiveTab('saved-builds');
  }, [components, totals]);

  const value: BuildContextType = {
    components,
    activeTab,
    selectedSlot,
    showSwapModal,
    swapCategory,
    swapOptions,
    totals,
    savedBuilds,
    setActiveTab,
    selectSlot,
    removeComponent,
    swapComponent,
    openSwapModal,
    closeSwapModal,
    resolveConflictAM5,
    selectCase,
    resetBuild,
    applyPreset,
    saveBuild,
  };

  return <BuildContext.Provider value={value}>{children}</BuildContext.Provider>;
}

export function useBuild() {
  const context = useContext(BuildContext);
  if (!context) {
    throw new Error('useBuild must be used within a BuildProvider');
  }
  return context;
}
