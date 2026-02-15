import {
    Heart,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomJumbotron } from "@/components/custom/CustomJumbotron"
import { HeroStats } from "@/heroes/components/HeroStats"
import { HeroGrid } from "@/heroes/components/HeroGrid"
import { CustomPagination } from "@/components/custom/CustomPagination"
import { CustomBreadCumbs } from "@/components/custom/CustomBreadCumbs"
import { useSearchParams } from "react-router"
import { use, useMemo } from "react"
import { useHeroSummary } from "@/heroes/hooks/useHeroSummary"
import { usePaginatedHero } from "@/heroes/hooks/usePaginatedHero"
import { FavoriteHeroContext } from "@/heroes/context/FavoriteHeroContext"



export const HomePage = () => {

    const { favoriteCount, favorites } = use(FavoriteHeroContext);

    const [searchParams, setSearchParams] = useSearchParams({ tab: "all" });

    const activeTab = searchParams.get('tab') ?? 'all';
    let page = searchParams.get('page') ?? '1';
    if (page === '') page = '1'
    let limit = searchParams.get('limit') ?? '6';
    if (limit === '') limit = '6'
    let category = searchParams.get('category') ?? 'all';
    if (category === '') page = 'all'

    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains']
        return validTabs.includes(activeTab) ? activeTab : 'all';
    }, [activeTab])

    const validCategory = useMemo(() => {
        const validCategories = ['all', 'hero', 'villain']
        return validCategories.includes(category) ? category : 'all';
    }, [activeTab])

    const { data: heroesResponse } = usePaginatedHero(page, limit, validCategory);

    const { data: summary } = useHeroSummary();

    return (
        <>
            <>
                {/* Header */}
                <CustomJumbotron title="Universo de superheroes" description="Descubre, explora y administra super héroes y villanos" />

                {/* Breadcumbs */}
                <CustomBreadCumbs currentPage="Super Héroes" />

                {/* Stats Dashboard */}
                <HeroStats />

                {/* Tabs */}
                <Tabs value={selectedTab} className="mb-8">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'all');
                                prev.set('category', 'all');
                                prev.set('page', '1');
                                return prev;
                            })}
                            value="all"
                        >
                            All Characters ({summary?.totalHeroes})
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'favorites');
                                return prev;
                            })}
                            value="favorites"
                            className="flex items-center gap-2"
                        >
                            <Heart className="h-4 w-4" />
                            Favorites ({favoriteCount})
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'heroes');
                                prev.set('category', 'hero');
                                prev.set('page', '1');
                                return prev;
                            })}
                            value="heroes"
                        >
                            Heroes ({summary?.heroCount})
                        </TabsTrigger>
                        <TabsTrigger
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'villains');
                                prev.set('category', 'villain');
                                prev.set('page', '1');
                                return prev;
                            })}
                            value="villains"
                        >
                            Villains ({summary?.villainCount})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        {/* Todos los personajes */}
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>

                    <TabsContent value="favorites">
                        {/* Todos los favoritos */}
                        <h1>Favoritos</h1>
                        <HeroGrid heroes={favorites} />
                    </TabsContent>

                    <TabsContent value="heroes">
                        {/* Todos los heroes */}
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>

                    <TabsContent value="villains">
                        {/* Todos los villanos */}
                        <HeroGrid heroes={heroesResponse?.heroes ?? []} />
                    </TabsContent>
                </Tabs>

                {/* Pagination */}
                <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
            </>
        </ >
    )
}
