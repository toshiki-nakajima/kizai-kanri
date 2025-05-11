import {data, LoaderFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {requireUser} from "~/utils/auth.server";
import {User} from "~/types/user";
import UserLayout from "~/components/userLayout";
import {useState} from "react";

export const loader: LoaderFunction = async ({request}) => {
    const user = await requireUser(request);

    return data({user});
};
// 重要：渡りのコンポーネントを表示しないようにするため、handle プロパティを設定
export const handle = {
    // これにより、親ルートの Outlet がスキップされるようにする設定が可能
    // Remix v2以降では、特定のプロパティを使ってこのような設定ができます
};

interface LoaderData {
    user: User;
}

export default function Reservations() {
    const {user} = useLoaderData<LoaderData>();
    const [equipments, setEquipments] = useState([
        {id: BigInt(1), name: 'ドリル', quantity: 2, originalQuantity: 2, changed: false, isNew: false},
        {id: BigInt(2), name: 'ハンマー', quantity: 5, originalQuantity: 5, changed: false, isNew: false},
        {id: BigInt(3), name: '脚立', quantity: 1, originalQuantity: 1, changed: false, isNew: false},
        {id: BigInt(4), name: '電動ノコギリ', quantity: 3, originalQuantity: 3, changed: false, isNew: false},
        {id: BigInt(5), name: '安全帽', quantity: 10, originalQuantity: 10, changed: false, isNew: false},
    ]);
    const equipmentsFetched = [
        {id: BigInt(1), name: 'ドリル', type: '電動工具', typeId: 1},
        {id: BigInt(2), name: 'ハンマー', type: '手動工具', typeId: 2},
        {id: BigInt(3), name: '脚立', type: '高所作業用具', typeId: 3},
        {id: BigInt(4), name: '電動ノコギリ', type: '電動工具', typeId: 1},
        {id: BigInt(5), name: '安全帽', type: '安全装備', typeId: 4},
        {id: BigInt(6), name: 'スコップ', type: '手動工具', typeId: 2},
        {id: BigInt(7), name: 'チェーンソー', type: '電動工具', typeId: 1},
    ]
    const [newEquipment, setNewEquipment] = useState({
        id: BigInt(0),
        name: "",
        typeId: equipmentsFetched[0].typeId,
        quantity: 1,
    });
    const equipmentTypes = [
        {id: 1, name: '電動工具'},
        {id: 2, name: '手動工具'},
        {id: 3, name: '高所作業用具'},
        {id: 4, name: '安全装備'},
    ]
    const filteredEquipmentsFetched = equipmentsFetched.filter(equipment => {
        return equipment.typeId === newEquipment.typeId;
    });
    const handleQuantityChange = (id: bigint, newQuantity: number) => {
        // 数量が0未満にならないようにチェック
        if (newQuantity < 0) return;

        setEquipments(equipments.map(equipment => {
            if (equipment.id === id) {
                const changed = newQuantity !== equipment.originalQuantity;
                return {...equipment, quantity: newQuantity, changed};
            }
            return equipment;
        }));
    };
    const handleSave = (id: bigint) => {
        setEquipments(equipments.map(equipment => {
            if (equipment.id === id) {
                return {
                    ...equipment,
                    originalQuantity: equipment.quantity,
                    changed: false,
                    isNew: false
                };
            }
            return equipment;
        }));
    };
    const [searchQuery, setSearchQuery] = useState("");

    // 検索処理
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // 検索ロジックを実装
        console.log("Searching for:", searchQuery);
    };

    const handleSelectType = (id: number) => {
        const selectedType = equipmentTypes.find(type => type.id === id);
        if (selectedType) {
            setNewEquipment({
                id: BigInt(0),
                name: "",
                typeId: selectedType.id,
                quantity: 1
            });
        }
    }
    const handleSelectEquipment = (id: bigint) => {
        const selectedEquipment = equipmentsFetched.find(equipment => equipment.id === id);
        if (selectedEquipment) {
            setNewEquipment({
                ...newEquipment,
                id: selectedEquipment.id,
                name: selectedEquipment.name,
                typeId: selectedEquipment.typeId
            });
        }
    }

    // 新規機材追加
    const handleAddEquipment = (e: React.FormEvent) => {
        e.preventDefault();
        // 追加ロジックを実装
        console.log("Adding new equipment:", newEquipment);
        if (newEquipment.name && newEquipment.typeId) {
            setEquipments([
                ...equipments,
                {
                    id: BigInt(equipments.length + 1),
                    name: newEquipment.name,
                    quantity: newEquipment.quantity,
                    originalQuantity: newEquipment.quantity,
                    changed: false,
                    isNew: true
                }
            ]);
            // setNewEquipment({...newEquipment, id: BigInt(0), name: "", quantity: 1}); // フォームをリセット
        }

    };

    return (
        <UserLayout user={user}>
            <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-800">
                <div className="px-4 py-4 sm:px-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        機材表
                    </h1>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        現場での使用機材と数量
                    </p>
                </div>

                {/* スプリットパネルレイアウト */}
                <div className="flex flex-1 overflow-hidden">
                    {/* 左パネル: 機材テーブル */}
                    <div className="w-2/3 p-4 overflow-auto bg-white dark:bg-gray-800">
                        <table className="min-w-40 divide-y divide-gray-200 shadow p-4 table-fixed">
                            <colgroup>
                                <col className="w-1/4"/>
                                {/* 機材名 */}
                                <col className="w-1/4"/>
                                {/* 使用数量 */}
                                <col className="w-1/5"/>
                                {/* 数量調整 */}
                                <col className="w-1/10"/>
                                {/* アクション */}
                            </colgroup>

                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    機材名
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    使用数量
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    数量調整
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                </th>
                            </tr>
                            </thead>
                            <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                                <td colSpan={3} className="px-6 py-3">
                                    <div className="flex justify-between items-center">
                                                <span className="text-xs text-gray-500">
                                                    <span
                                                        className="inline-block w-3 h-3 bg-blue-50 border border-blue-200 mr-1"></span>
                                                    青色の行は未保存の変更があります
                                                </span>
                                        <button
                                            onClick={() => {
                                                // すべての変更を保存
                                                setEquipments(equipments.map(equipment => ({
                                                    ...equipment,
                                                    originalQuantity: equipment.quantity,
                                                    changed: false,
                                                    isNew: false
                                                })));
                                            }}
                                            className={`px-4 py-2 text-sm font-medium rounded ${equipments.some(e => e.changed || e.isNew)
                                                ? "bg-green-500 text-white hover:bg-green-600"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                                            disabled={!equipments.some(e => e.changed || e.isNew)}
                                        >
                                            すべての変更を保存
                                        </button>
                                    </div>
                                </td>
                                <td></td>
                            </tr>
                            </tfoot>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {equipments.map((equipment) => (
                                <tr key={equipment.id}
                                    className={equipment.changed || equipment.isNew ? "bg-blue-50" : ""}>
                                    <td className="px-6 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {equipment.name}
                                        {
                                            equipment.isNew
                                                ? (<span className="text-white bg-green-500 px-1 ml-1 rounded">新規</span>)
                                                : null
                                        }
                                    </td>
                                    <td className={`px-6 py-1 whitespace-nowrap text-sm font-medium ${equipment.changed ? "text-blue-600" : "text-gray-500"}`}>
                                        {equipment.quantity}
                                        {equipment.changed && (
                                            <span
                                                className="ml-2 text-xs text-gray-500">({equipment.originalQuantity}から変更)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex">
                                                <button
                                                    onClick={() => handleQuantityChange(equipment.id, equipment.quantity - 1)}
                                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 p-1 rounded-l focus:outline-none"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd"
                                                              d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </button>
                                                <input
                                                    type="number"
                                                    value={equipment.quantity}
                                                    onChange={(e) => handleQuantityChange(equipment.id, parseInt(e.target.value) || 0)}
                                                    className={`w-16 text-center border-t border-b bg-white ${equipment.changed ? "bg-blue-50 border-blue-200" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600`}
                                                />
                                                <button
                                                    onClick={() => handleQuantityChange(equipment.id, equipment.quantity + 1)}
                                                    className="bg-gray-200 text-gray-700 hover:bg-gray-300 p-1 rounded-r focus:outline-none"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                         viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd"
                                                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                                              clipRule="evenodd"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-2 py-1`}>
                                        {equipment.changed && (
                                            <button
                                                onClick={() => handleSave(equipment.id)}
                                                className="ml-2 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                                保存
                                            </button>
                                        )}

                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 右パネル: 検索と追加 */}
                    <div className="w-1/3 p-4 overflow-auto bg-gray-100 dark:bg-gray-800">
                        {/* 検索フォーム */}
                        <div className="bg-white dark:bg-gray-700 rounded-lg shadow p-4 mb-4">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white">機材追加</h2>
                            <form onSubmit={handleSearch}>
                                <div className="mb-4">
                                    <label htmlFor={`type`}
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        種類
                                    </label>
                                    <select
                                        id={`type`}
                                        value={newEquipment.typeId}
                                        onChange={(e) => handleSelectType(Number(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        {equipmentTypes.map((equipmentType) => (
                                            <option key={equipmentType.id} value={equipmentType.id}>
                                                {equipmentType.name}
                                            </option>
                                        ))} </select></div>
                                <div className="mb-4">
                                    <label htmlFor={`name`}
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        機材名
                                    </label>
                                    <select
                                        id={`name`}
                                        value={Number(newEquipment.id)}
                                        onChange={(e) => handleSelectEquipment(BigInt(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        <option key="none" value="">
                                            選択してください
                                        </option>
                                        {filteredEquipmentsFetched.map((equipment) => (
                                            <option key={equipment.id} value={Number(equipment.id)}>
                                                {equipment.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor={`quantity`}
                                           className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        数量
                                    </label>
                                    <select
                                        id={`quantity`}
                                        value={newEquipment.quantity}
                                        onChange={(e) => setNewEquipment({
                                            ...newEquipment,
                                            quantity: Number(e.target.value)
                                        })}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        {[...Array(10).keys()].map((i) => (
                                            <option key={i} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    onClick={handleAddEquipment}
                                    className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                                >
                                    追加
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}