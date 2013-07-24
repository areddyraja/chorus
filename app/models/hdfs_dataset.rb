class HdfsDataset < Dataset
  include SharedSearch

  alias_attribute :file_mask, :query
  attr_accessible :file_mask
  validates_presence_of :file_mask, :workspace
  validate :ensure_active_workspace, :if => Proc.new { |f| f.changed? }

  belongs_to :hdfs_data_source
  belongs_to :workspace
  delegate :data_source, :connect_with, :connect_as, :to => :hdfs_data_source

  include_shared_search_fields :workspace, :workspace

  HdfsContentsError = Class.new(StandardError)

  def self.assemble!(attributes, hdfs_data_source, workspace)
      dataset = HdfsDataset.new attributes
      dataset.hdfs_data_source = hdfs_data_source
      dataset.workspace = workspace
      dataset.save!
      dataset
  end

  ## include bogus definitions for fields that are searchable in other models
  [:database_name, :table_description, :schema_name, :column_name, :column_description].each do |searchable_field|
    define_method(searchable_field) do
      nil
    end
  end

  def data_source_account_ids
    []
  end

  def found_in_workspace_id
    [workspace_id]
  end

  def contents
    hdfs_query = Hdfs::QueryService.new(hdfs_data_source.host, hdfs_data_source.port, hdfs_data_source.username, hdfs_data_source.version)
    hdfs_query.show(file_mask)
  rescue StandardError => e
    raise HdfsContentsError.new(e)
  end

  def self.source_class
    HdfsDataSource
  end

  def in_workspace?(workspace)
    self.workspace == workspace
  end

  def associable?
    false
  end

  def needs_schema?
    false
  end

  def accessible_to(user)
    true
  end

  def verify_in_source(user)
    true
  end

  def execution_location
    hdfs_data_source
  end

  def ensure_active_workspace
    self.errors[:dataset] << :ARCHIVED if workspace && workspace.archived?
  end
end